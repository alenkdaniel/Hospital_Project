import { useEffect, useState, useCallback } from "react";

import { useDispatch } from "react-redux";

import { motion, AnimatePresence } from "framer-motion";

import toast from "react-hot-toast";

import medicineService from "../../features/medicine/Medicineservice ";

import medicalTestService from "../../features/medicalTest/medicalTestService";

import { completeConsultation } from "../../features/appointment/appointmentSlice";

import appointmentService from "../../features/appointment/appointmentService";

// =====================================
// PRESCRIPTION TIMING SLOTS
//
// Classic "1-0-1" style dosage timing
// used on a real prescription.
// =====================================

const TIMING_SLOTS = [
  { key: "morning", label: "Morning" },
  { key: "afternoon", label: "Afternoon" },
  { key: "night", label: "Night" },
];

const MEAL_OPTIONS = [
  { key: "before", label: "Before Food" },
  { key: "after", label: "After Food" },
];

// Builds the "1-0-1" style frequency code from the selected timing slots.

const buildFrequencyCode = (timing) =>
  TIMING_SLOTS.map((slot) => (timing[slot.key] ? "1" : "0")).join("-");

// Parses a stored "1-0-1" code (or free text) back into timing booleans.
// Falls back to all-false if the value isn't in the expected format.

const parseFrequencyCode = (frequency) => {
  const parts = (frequency || "").split("-");

  const timing = {};

  TIMING_SLOTS.forEach((slot, index) => {
    timing[slot.key] = parts[index] === "1";
  });

  return timing;
};

// =====================================
// CONSULTATION MODAL
//
// Doctor adds diagnosis, medicines,
// tests and remarks, then completes
// the consultation.
// =====================================

const ConsultationModal = ({ appointment, onClose }) => {
  
  const dispatch = useDispatch();

  const isReadOnly = appointment?.status === "completed";

  const existingConsultation = appointment?.consultation;

  // =====================================
  // FORM STATE
  // =====================================

  const [diagnosis, setDiagnosis] = useState(
    existingConsultation?.diagnosis || "",
  );

  const [remarks, setRemarks] = useState(existingConsultation?.remarks || "");

  const [followUpDate, setFollowUpDate] = useState(
    existingConsultation?.followUpDate
      ? existingConsultation.followUpDate.slice(0, 10)
      : "",
  );

  const [medicines, setMedicines] = useState(
    (existingConsultation?.medicines || []).map((item) => ({
      medicine: item.medicine?._id || item.medicine,
      name: item.medicine?.name || "Medicine",
      quantity: item.quantity || "",
      dosage: item.dosage || "",
      frequency: item.frequency || "",
      timing: parseFrequencyCode(item.frequency),
      mealTiming: item.mealTiming || "",
      duration: item.duration || "",
      instructions: item.instructions || "",
    })),
  );

  const [tests, setTests] = useState(
    (existingConsultation?.tests || []).map((item) => ({
      test: item.test?._id || item.test,
      name: item.test?.name || "Test",
      notes: item.notes || "",
    })),
  );

  const [submitting, setSubmitting] = useState(false);

  // =====================================
  // PATIENT HISTORY WITH THIS DOCTOR
  //
  // When the SAME doctor sees a returning
  // patient, show a summary of their own
  // past diagnoses with this patient.
  //
  // A different doctor never fetches or
  // sees this — each doctor only ever
  // pulls their own history, so a new
  // doctor always starts a blank
  // consultation.
  // =====================================

  const [patientHistory, setPatientHistory] = useState([]);

  const [historyLoading, setHistoryLoading] = useState(false);

  const [historyExpanded, setHistoryExpanded] = useState(false);

  useEffect(() => {
    if (isReadOnly) return;

    const patientId = appointment?.patient?._id;

    if (!patientId) return;

    const loadHistory = async () => {
      setHistoryLoading(true);

      try {
        const response = await appointmentService.getPatientHistoryWithDoctor(
          patientId,
          appointment?._id,
        );

        setPatientHistory(response.history || []);
      } catch (error) {
        setPatientHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    };

    loadHistory();
  }, [isReadOnly, appointment?.patient?._id, appointment?._id]);

  // =====================================
  // MEDICINE DROPDOWN
  //
  // Loads the FULL list of medicines added
  // by the hospital once, then shows it as
  // a dropdown the doctor can browse/filter
  // instead of only type-ahead search.
  // =====================================

  const [medicineKeyword, setMedicineKeyword] = useState("");

  const [allMedicines, setAllMedicines] = useState([]);

  const [medicineLoading, setMedicineLoading] = useState(false);

  const [medicineDropdownOpen, setMedicineDropdownOpen] = useState(false);

  useEffect(() => {
    if (isReadOnly) return;

    const loadMedicines = async () => {
      setMedicineLoading(true);

      try {
        const response = await medicineService.getMedicines({ limit: 1000 });

        setAllMedicines(response.medicines || []);
      } catch (error) {
        setAllMedicines([]);
      } finally {
        setMedicineLoading(false);
      }
    };

    loadMedicines();
  }, [isReadOnly]);

  // Filters the already-loaded hospital medicine list locally —
  // shows the FULL list when the field is empty (dropdown mode),
  // and narrows it down as the doctor types.

  const medicineResults = medicineKeyword.trim()
    ? allMedicines.filter((item) => {
        const q = medicineKeyword.trim().toLowerCase();

        return (
          item.name?.toLowerCase().includes(q) ||
          item.genericName?.toLowerCase().includes(q) ||
          item.brandName?.toLowerCase().includes(q)
        );
      })
    : allMedicines;

  const addMedicine = (item) => {
    if (medicines.some((m) => m.medicine === item._id)) {
      toast.error("Medicine already added");

      return;
    }

    setMedicines((prev) => [
      ...prev,
      {
        medicine: item._id,
        name: item.name,
        quantity: "",
        dosage: item.strength || "",
        frequency: "",
        timing: { morning: false, afternoon: false, night: false },
        mealTiming: "",
        duration: "",
        instructions: "",
      },
    ]);

    setMedicineKeyword("");

    setMedicineDropdownOpen(false);
  };

  const updateMedicineField = (index, field, value) => {
    setMedicines((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  const removeMedicine = (index) => {
    setMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  // Toggles a Morning / Afternoon / Night slot and keeps the
  // "1-0-1" style frequency code in sync with it.

  const toggleMedicineTiming = (index, slotKey) => {
    setMedicines((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;

        const timing = {
          ...item.timing,
          [slotKey]: !item.timing?.[slotKey],
        };

        return {
          ...item,
          timing,
          frequency: buildFrequencyCode(timing),
        };
      }),
    );
  };

  const setMedicineMealTiming = (index, mealKey) => {
    setMedicines((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              mealTiming: item.mealTiming === mealKey ? "" : mealKey,
            }
          : item,
      ),
    );
  };

  // =====================================
  // TEST DROPDOWN
  //
  // Loads the FULL list of medical tests
  // added by the hospital once, then shows
  // it as a dropdown the doctor can browse
  // /filter instead of only type-ahead search.
  // =====================================

  const [testKeyword, setTestKeyword] = useState("");

  const [allTests, setAllTests] = useState([]);

  const [testLoading, setTestLoading] = useState(false);

  const [testDropdownOpen, setTestDropdownOpen] = useState(false);

  useEffect(() => {
    if (isReadOnly) return;

    const loadTests = async () => {
      setTestLoading(true);

      try {
        const response = await medicalTestService.getMedicalTests({
          limit: 1000,
        });

        setAllTests(response.medicalTests || []);
      } catch (error) {
        setAllTests([]);
      } finally {
        setTestLoading(false);
      }
    };

    loadTests();
  }, [isReadOnly]);

  // Filters the already-loaded hospital test list locally —
  // shows the FULL list when the field is empty (dropdown mode),
  // and narrows it down as the doctor types.

  const testResults = testKeyword.trim()
    ? allTests.filter((item) => {
        const q = testKeyword.trim().toLowerCase();

        return (
          item.name?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q)
        );
      })
    : allTests;

  const addTest = (item) => {
    if (tests.some((t) => t.test === item._id)) {
      toast.error("Test already added");

      return;
    }

    setTests((prev) => [
      ...prev,
      {
        test: item._id,
        name: item.name,
        notes: "",
      },
    ]);

    setTestKeyword("");

    setTestDropdownOpen(false);
  };

  const updateTestField = (index, field, value) => {
    setTests((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  const removeTest = (index) => {
    setTests((prev) => prev.filter((_, i) => i !== index));
  };

  // =====================================
  // SUBMIT
  // =====================================

  const handleSubmit = useCallback(async () => {
    if (!diagnosis.trim()) {
      toast.error("Diagnosis is required");

      return;
    }

    const payload = {
      diagnosis: diagnosis.trim(),

      medicines: medicines.map((item) => ({
        medicine: item.medicine,
        quantity: item.quantity,
        dosage: item.dosage,
        frequency: item.frequency,
        mealTiming: item.mealTiming,
        duration: item.duration,
        instructions: item.instructions,
      })),

      tests: tests.map((item) => ({
        test: item.test,
        notes: item.notes,
      })),

      remarks: remarks.trim(),

      followUpDate: followUpDate || undefined,
    };

    setSubmitting(true);

    try {
      await dispatch(
        completeConsultation({
          id: appointment._id,
          data: payload,
        }),
      ).unwrap();

      toast.success("Consultation completed successfully");

      onClose();
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to complete consultation");
    } finally {
      setSubmitting(false);
    }
  }, [diagnosis, medicines, tests, remarks, followUpDate, appointment, dispatch, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        >
          {/* HEADER */}

          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-t-3xl p-6 text-white sticky top-0 z-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {isReadOnly ? "🩺 Consultation Summary" : "🩺 Doctor Consultation"}
              </h2>

              <p className="text-blue-100 mt-1 text-sm">
                Patient: {appointment?.patient?.name} &middot; #
                {appointment?.booking?.appointmentNumber}
              </p>
            </div>

            <button
              onClick={onClose}
              className="text-white/90 hover:text-white text-2xl leading-none"
            >
              &times;
            </button>
          </div>

          <div className="p-6 space-y-8">
            {/* SYMPTOMS */}

            {appointment?.medical?.symptoms && (
              <div className="bg-gray-50 rounded-2xl p-4">
                <h3 className="font-bold text-gray-700 mb-1">Symptoms</h3>

                <p className="text-gray-600">{appointment.medical.symptoms}</p>
              </div>
            )}

            {/* PREVIOUS VISITS WITH THIS DOCTOR */}

            {!isReadOnly && historyLoading && (
              <div className="bg-blue-50 rounded-2xl p-4 text-sm text-blue-500">
                Checking for previous visits with you...
              </div>
            )}

            {!isReadOnly && !historyLoading && patientHistory.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <button
                  type="button"
                  onClick={() => setHistoryExpanded((prev) => !prev)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <div>
                    <h3 className="font-bold text-amber-800">
                      📋 Returning Patient — {patientHistory.length} previous
                      visit{patientHistory.length === 1 ? "" : "s"} with you
                    </h3>

                    <p className="text-amber-700 text-sm mt-1">
                      Last diagnosis (
                      {new Date(
                        patientHistory[0].consultationDate ||
                          patientHistory[0].appointmentDate,
                      ).toLocaleDateString()}
                      ): {patientHistory[0].diagnosis}
                    </p>

                    {patientHistory[0].tests?.length > 0 && (
                      <p className="text-amber-700 text-sm mt-1">
                        Tests already done:{" "}
                        {patientHistory[0].tests
                          .map((t) => t.test?.name)
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}
                  </div>

                  <span className="text-amber-600 font-semibold text-sm shrink-0 ml-4">
                    {historyExpanded ? "Hide ▲" : "View all ▼"}
                  </span>
                </button>

                {historyExpanded && (
                  <div className="mt-4 space-y-3">
                    {patientHistory.map((visit) => (
                      <div
                        key={visit.appointmentId}
                        className="bg-white rounded-xl p-4 text-sm"
                      >
                        <p className="font-semibold text-gray-700">
                          {new Date(
                            visit.consultationDate || visit.appointmentDate,
                          ).toLocaleDateString()}
                        </p>

                        <p className="text-gray-600 mt-1">
                          Diagnosis: {visit.diagnosis || "—"}
                        </p>

                        {visit.medicines?.length > 0 && (
                          <p className="text-gray-500 mt-1">
                            Medicines:{" "}
                            {visit.medicines
                              .map((m) => m.medicine?.name)
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        )}

                        {visit.tests?.length > 0 && (
                          <p className="text-gray-500 mt-1">
                            Tests:{" "}
                            {visit.tests
                              .map((t) => t.test?.name)
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        )}

                        {visit.remarks && (
                          <p className="text-gray-500 mt-1">
                            Remarks: {visit.remarks}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* DIAGNOSIS */}

            <div>
              <label className="font-bold text-gray-700 block mb-2">
                Diagnosis *
              </label>

              <textarea
                disabled={isReadOnly}
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                rows={3}
                placeholder="Enter diagnosis..."
                className="w-full bg-gray-100 disabled:bg-gray-50 rounded-xl p-3 outline-none resize-none"
              />
            </div>

            {/* MEDICINES */}

            <div>
              <h3 className="font-bold text-gray-700 mb-2">💊 Medicines</h3>

              {!isReadOnly && (
                <div className="relative mb-3">
                  <input
                    value={medicineKeyword}
                    onFocus={() => setMedicineDropdownOpen(true)}
                    onBlur={() =>
                      setTimeout(() => setMedicineDropdownOpen(false), 150)
                    }
                    onChange={(e) => {
                      setMedicineKeyword(e.target.value);
                      setMedicineDropdownOpen(true);
                    }}
                    placeholder="Click to choose from hospital medicine list..."
                    className="w-full bg-gray-100 rounded-xl p-3 outline-none"
                  />

                  {medicineDropdownOpen && (
                    <div className="absolute left-0 right-0 bg-white shadow-xl rounded-xl mt-1 z-20 max-h-60 overflow-y-auto border">
                      {medicineLoading && (
                        <p className="p-3 text-sm text-gray-400">Loading medicines...</p>
                      )}

                      {!medicineLoading && medicineResults.length === 0 && (
                        <p className="p-3 text-sm text-gray-400">
                          {allMedicines.length === 0
                            ? "No medicines added by the hospital yet"
                            : "No medicines found"}
                        </p>
                      )}

                      {!medicineLoading &&
                        medicineResults.map((item) => (
                          <button
                            key={item._id}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => addMedicine(item)}
                            className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b last:border-0"
                          >
                            <span className="font-semibold">{item.name}</span>

                            {item.strength && (
                              <span className="text-gray-400 text-sm"> &middot; {item.strength}</span>
                            )}

                            {item.dosageForm && (
                              <span className="text-gray-400 text-sm"> &middot; {item.dosageForm}</span>
                            )}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {medicines.length === 0 && (
                <p className="text-gray-400 text-sm">No medicines added</p>
              )}

              <div className="space-y-3">
                {medicines.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{item.name}</h4>

                      {!isReadOnly && (
                        <button
                          type="button"
                          onClick={() => removeMedicine(index)}
                          className="text-red-500 text-sm font-semibold"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <input
                        disabled={isReadOnly}
                        value={item.quantity}
                        onChange={(e) => updateMedicineField(index, "quantity", e.target.value)}
                        placeholder="Qty per dose (e.g. 1 tablet)"
                        className="bg-white disabled:bg-gray-100 rounded-lg p-2 text-sm outline-none border"
                      />

                      <input
                        disabled={isReadOnly}
                        value={item.dosage}
                        onChange={(e) => updateMedicineField(index, "dosage", e.target.value)}
                        placeholder="Strength (e.g. 500mg)"
                        className="bg-white disabled:bg-gray-100 rounded-lg p-2 text-sm outline-none border"
                      />

                      <input
                        disabled={isReadOnly}
                        value={item.duration}
                        onChange={(e) => updateMedicineField(index, "duration", e.target.value)}
                        placeholder="Duration (e.g. 5 days)"
                        className="bg-white disabled:bg-gray-100 rounded-lg p-2 text-sm outline-none border"
                      />

                      <input
                        disabled={isReadOnly}
                        value={item.instructions}
                        onChange={(e) => updateMedicineField(index, "instructions", e.target.value)}
                        placeholder="Special instructions"
                        className="bg-white disabled:bg-gray-100 rounded-lg p-2 text-sm outline-none border"
                      />
                    </div>

                    {/* PRESCRIPTION TIMING — Morning / Afternoon / Night */}

                    <div className="mt-3 flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-500">
                          Timing:
                        </span>

                        {TIMING_SLOTS.map((slot) => (
                          <button
                            key={slot.key}
                            type="button"
                            disabled={isReadOnly}
                            onClick={() => toggleMedicineTiming(index, slot.key)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                              item.timing?.[slot.key]
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-500 border-gray-300"
                            } disabled:opacity-60`}
                          >
                            {slot.label}
                          </button>
                        ))}

                        {item.frequency && (
                          <span className="text-xs text-gray-400 font-mono">
                            ({item.frequency})
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-500">
                          Food:
                        </span>

                        {MEAL_OPTIONS.map((meal) => (
                          <button
                            key={meal.key}
                            type="button"
                            disabled={isReadOnly}
                            onClick={() => setMedicineMealTiming(index, meal.key)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                              item.mealTiming === meal.key
                                ? "bg-cyan-600 text-white border-cyan-600"
                                : "bg-white text-gray-500 border-gray-300"
                            } disabled:opacity-60`}
                          >
                            {meal.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TESTS */}

            <div>
              <h3 className="font-bold text-gray-700 mb-2">🧪 Recommended Tests</h3>

              {!isReadOnly && (
                <div className="relative mb-3">
                  <input
                    value={testKeyword}
                    onFocus={() => setTestDropdownOpen(true)}
                    onBlur={() =>
                      setTimeout(() => setTestDropdownOpen(false), 150)
                    }
                    onChange={(e) => {
                      setTestKeyword(e.target.value);
                      setTestDropdownOpen(true);
                    }}
                    placeholder="Click to choose from hospital test list..."
                    className="w-full bg-gray-100 rounded-xl p-3 outline-none"
                  />

                  {testDropdownOpen && (
                    <div className="absolute left-0 right-0 bg-white shadow-xl rounded-xl mt-1 z-20 max-h-60 overflow-y-auto border">
                      {testLoading && (
                        <p className="p-3 text-sm text-gray-400">Loading tests...</p>
                      )}

                      {!testLoading && testResults.length === 0 && (
                        <p className="p-3 text-sm text-gray-400">
                          {allTests.length === 0
                            ? "No tests added by the hospital yet"
                            : "No tests found"}
                        </p>
                      )}

                      {!testLoading &&
                        testResults.map((item) => (
                          <button
                            key={item._id}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => addTest(item)}
                            className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b last:border-0"
                          >
                            <span className="font-semibold">{item.name}</span>

                            {item.category && (
                              <span className="text-gray-400 text-sm"> &middot; {item.category}</span>
                            )}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {tests.length === 0 && (
                <p className="text-gray-400 text-sm">No tests added</p>
              )}

              <div className="space-y-3">
                {tests.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{item.name}</h4>

                      {!isReadOnly && (
                        <button
                          type="button"
                          onClick={() => removeTest(index)}
                          className="text-red-500 text-sm font-semibold"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <input
                      disabled={isReadOnly}
                      value={item.notes}
                      onChange={(e) => updateTestField(index, "notes", e.target.value)}
                      placeholder="Notes (optional)"
                      className="w-full bg-white disabled:bg-gray-100 rounded-lg p-2 text-sm outline-none border"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* REMARKS + FOLLOW UP */}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="font-bold text-gray-700 block mb-2">
                  Remarks
                </label>

                <textarea
                  disabled={isReadOnly}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                  placeholder="Doctor's remarks / suggestions..."
                  className="w-full bg-gray-100 disabled:bg-gray-50 rounded-xl p-3 outline-none resize-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-2">
                  Follow-up Date
                </label>

                <input
                  type="date"
                  disabled={isReadOnly}
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full bg-gray-100 disabled:bg-gray-50 rounded-xl p-3 outline-none"
                />
              </div>
            </div>
          </div>

          {/* FOOTER */}

          {!isReadOnly && (
            <div className="p-6 border-t flex justify-end gap-3 sticky bottom-0 bg-white rounded-b-3xl">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 disabled:opacity-60"
              >
                {submitting ? "Saving..." : "Complete Consultation"}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConsultationModal;