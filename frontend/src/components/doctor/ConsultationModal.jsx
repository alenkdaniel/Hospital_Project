import { useEffect, useState, useCallback } from "react";

import { useDispatch } from "react-redux";

import { motion, AnimatePresence } from "framer-motion";

import toast from "react-hot-toast";

import medicalTestService from "../../features/medicine/Medicineservice ";

import { completeConsultation } from "../../features/appointment/appointmentSlice";

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
      dosage: item.dosage || "",
      frequency: item.frequency || "",
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
  // MEDICINE SEARCH
  // =====================================

  const [medicineKeyword, setMedicineKeyword] = useState("");

  const [medicineResults, setMedicineResults] = useState([]);

  const [medicineSearching, setMedicineSearching] = useState(false);

  useEffect(() => {
    if (!medicineKeyword.trim()) {
      setMedicineResults([]);

      return;
    }

    setMedicineSearching(true);

    const timer = setTimeout(async () => {
      try {
        const response = await medicineService.searchMedicines(
          medicineKeyword.trim(),
        );

        setMedicineResults(response.medicines || []);
      } catch (error) {
        setMedicineResults([]);
      } finally {
        setMedicineSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [medicineKeyword]);

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
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ]);

    setMedicineKeyword("");

    setMedicineResults([]);
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

  // =====================================
  // TEST SEARCH
  // =====================================

  const [testKeyword, setTestKeyword] = useState("");

  const [testResults, setTestResults] = useState([]);

  const [testSearching, setTestSearching] = useState(false);

  useEffect(() => {
    if (!testKeyword.trim()) {
      setTestResults([]);

      return;
    }

    setTestSearching(true);

    const timer = setTimeout(async () => {
      try {
        const response = await medicalTestService.searchMedicalTests(
          testKeyword.trim(),
        );

        setTestResults(response.medicalTests || []);
      } catch (error) {
        setTestResults([]);
      } finally {
        setTestSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [testKeyword]);

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

    setTestResults([]);
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
        dosage: item.dosage,
        frequency: item.frequency,
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
                    onChange={(e) => setMedicineKeyword(e.target.value)}
                    placeholder="Search medicine by name..."
                    className="w-full bg-gray-100 rounded-xl p-3 outline-none"
                  />

                  {medicineKeyword.trim() && (
                    <div className="absolute left-0 right-0 bg-white shadow-xl rounded-xl mt-1 z-20 max-h-52 overflow-y-auto border">
                      {medicineSearching && (
                        <p className="p-3 text-sm text-gray-400">Searching...</p>
                      )}

                      {!medicineSearching && medicineResults.length === 0 && (
                        <p className="p-3 text-sm text-gray-400">No medicines found</p>
                      )}

                      {medicineResults.map((item) => (
                        <button
                          key={item._id}
                          type="button"
                          onClick={() => addMedicine(item)}
                          className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b last:border-0"
                        >
                          <span className="font-semibold">{item.name}</span>

                          {item.strength && (
                            <span className="text-gray-400 text-sm"> &middot; {item.strength}</span>
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
                        value={item.dosage}
                        onChange={(e) => updateMedicineField(index, "dosage", e.target.value)}
                        placeholder="Dosage (e.g. 500mg)"
                        className="bg-white disabled:bg-gray-100 rounded-lg p-2 text-sm outline-none border"
                      />

                      <input
                        disabled={isReadOnly}
                        value={item.frequency}
                        onChange={(e) => updateMedicineField(index, "frequency", e.target.value)}
                        placeholder="Frequency (e.g. 1-0-1)"
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
                        placeholder="Instructions (e.g. after food)"
                        className="bg-white disabled:bg-gray-100 rounded-lg p-2 text-sm outline-none border"
                      />
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
                    onChange={(e) => setTestKeyword(e.target.value)}
                    placeholder="Search test by name..."
                    className="w-full bg-gray-100 rounded-xl p-3 outline-none"
                  />

                  {testKeyword.trim() && (
                    <div className="absolute left-0 right-0 bg-white shadow-xl rounded-xl mt-1 z-20 max-h-52 overflow-y-auto border">
                      {testSearching && (
                        <p className="p-3 text-sm text-gray-400">Searching...</p>
                      )}

                      {!testSearching && testResults.length === 0 && (
                        <p className="p-3 text-sm text-gray-400">No tests found</p>
                      )}

                      {testResults.map((item) => (
                        <button
                          key={item._id}
                          type="button"
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
