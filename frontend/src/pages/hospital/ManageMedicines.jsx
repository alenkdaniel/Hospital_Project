import { useEffect, useState, useCallback } from "react";

import { Link } from "react-router-dom";

import { motion } from "framer-motion";

import toast from "react-hot-toast";

import medicineService from "../../features/medicine/Medicineservice ";

// =====================================
// DOSAGE FORM OPTIONS
// =====================================

const DOSAGE_FORMS = [
  "Tablet",
  "Capsule",
  "Syrup",
  "Injection",
  "Cream",
  "Drops",
  "Inhaler",
  "Ointment",
  "Powder",
  "Other",
];

const EMPTY_FORM = {
  name: "",
  genericName: "",
  brandName: "",
  category: "",
  dosageForm: "Tablet",
  strength: "",
  manufacturer: "",
};

// =====================================
// MANAGE MEDICINES
//
// Hospital Admin adds medicines to the
// hospital's medicine catalog. Doctors
// then search this catalog while writing
// a prescription during consultation.
// =====================================

const ManageMedicines = () => {
  const [medicines, setMedicines] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [form, setForm] = useState(EMPTY_FORM);

  const [editingId, setEditingId] = useState(null);

  const [showForm, setShowForm] = useState(false);

  // =====================================
  // LOAD MEDICINES
  // =====================================

  const loadMedicines = useCallback(async (keyword = "") => {
    setLoading(true);

    try {
      const response = await medicineService.getMedicines({
        search: keyword,
        limit: 100,
      });

      setMedicines(response.medicines || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load medicines",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMedicines();
  }, [loadMedicines]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadMedicines(search.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [search, loadMedicines]);

  // =====================================
  // FORM HANDLERS
  // =====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openAddForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (medicine) => {
    setForm({
      name: medicine.name || "",
      genericName: medicine.genericName || "",
      brandName: medicine.brandName || "",
      category: medicine.category || "",
      dosageForm: medicine.dosageForm || "Tablet",
      strength: medicine.strength || "",
      manufacturer: medicine.manufacturer || "",
    });

    setEditingId(medicine._id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Medicine name is required");
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        await medicineService.updateMedicine(editingId, form);
        toast.success("Medicine updated successfully");
      } else {
        await medicineService.createMedicine(form);
        toast.success("Medicine added successfully");
      }

      closeForm();
      loadMedicines(search.trim());
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          (editingId ? "Failed to update medicine" : "Failed to add medicine"),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (medicine) => {
    if (!window.confirm(`Remove "${medicine.name}" from the catalog?`)) {
      return;
    }

    try {
      await medicineService.deleteMedicine(medicine._id);
      toast.success("Medicine removed");
      loadMedicines(search.trim());
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to remove medicine",
      );
    }
  };

  // =====================================
  // RENDER
  // =====================================

  return (
    <div className="min-h-screen pt-28 px-10 bg-gray-50 pb-16">
      {/* HEADER */}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-bold">💊 Medicine Catalog</h1>

          <p className="mt-3 text-blue-100">
            Add medicines here so doctors can search and prescribe them
            during consultation.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/hospital-admin"
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold"
          >
            ← Dashboard
          </Link>

          <button
            onClick={openAddForm}
            className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50"
          >
            + Add Medicine
          </button>
        </div>
      </motion.div>

      {/* SEARCH */}

      <div className="mt-8 bg-white rounded-3xl shadow-lg p-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search medicines by name, generic name or brand..."
          className="w-full bg-gray-100 rounded-xl p-3 outline-none"
        />
      </div>

      {/* ADD / EDIT FORM */}

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white rounded-3xl shadow-lg p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {editingId ? "Edit Medicine" : "Add New Medicine"}
            </h2>

            <button
              onClick={closeForm}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              &times;
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-2 gap-5"
          >
            <div>
              <label className="font-semibold text-gray-700 block mb-2">
                Medicine Name *
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Paracetamol"
                className="w-full bg-gray-100 rounded-xl p-3 outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-2">
                Generic Name
              </label>

              <input
                name="genericName"
                value={form.genericName}
                onChange={handleChange}
                placeholder="e.g. Acetaminophen"
                className="w-full bg-gray-100 rounded-xl p-3 outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-2">
                Brand Name
              </label>

              <input
                name="brandName"
                value={form.brandName}
                onChange={handleChange}
                placeholder="e.g. Crocin"
                className="w-full bg-gray-100 rounded-xl p-3 outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-2">
                Category
              </label>

              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Analgesic"
                className="w-full bg-gray-100 rounded-xl p-3 outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-2">
                Dosage Form
              </label>

              <select
                name="dosageForm"
                value={form.dosageForm}
                onChange={handleChange}
                className="w-full bg-gray-100 rounded-xl p-3 outline-none"
              >
                {DOSAGE_FORMS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-2">
                Strength
              </label>

              <input
                name="strength"
                value={form.strength}
                onChange={handleChange}
                placeholder="e.g. 500mg"
                className="w-full bg-gray-100 rounded-xl p-3 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-semibold text-gray-700 block mb-2">
                Manufacturer
              </label>

              <input
                name="manufacturer"
                value={form.manufacturer}
                onChange={handleChange}
                placeholder="e.g. GSK"
                className="w-full bg-gray-100 rounded-xl p-3 outline-none"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeForm}
                className="px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Medicine"
                  : "Add Medicine"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* MEDICINE LIST */}

      <div className="mt-8 bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {medicines.length} Medicine{medicines.length === 1 ? "" : "s"}
        </h2>

        {loading && <p className="text-gray-400">Loading medicines...</p>}

        {!loading && medicines.length === 0 && (
          <p className="text-gray-400">
            No medicines found. Click "Add Medicine" to create your first
            entry.
          </p>
        )}

        <div className="space-y-3">
          {medicines.map((medicine) => (
            <div
              key={medicine._id}
              className="bg-gray-50 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div>
                <h3 className="font-bold text-gray-800">
                  {medicine.name}

                  {medicine.strength && (
                    <span className="text-gray-400 font-normal">
                      {" "}
                      &middot; {medicine.strength}
                    </span>
                  )}

                  <span className="ml-2 text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    {medicine.dosageForm}
                  </span>
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  {[
                    medicine.genericName,
                    medicine.brandName,
                    medicine.category,
                    medicine.manufacturer,
                  ]
                    .filter(Boolean)
                    .join(" · ") || "No additional details"}
                </p>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => openEditForm(medicine)}
                  className="px-4 py-2 rounded-lg font-semibold text-sm text-blue-600 hover:bg-blue-50 border border-blue-200"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(medicine)}
                  className="px-4 py-2 rounded-lg font-semibold text-sm text-red-600 hover:bg-red-50 border border-red-200"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageMedicines;