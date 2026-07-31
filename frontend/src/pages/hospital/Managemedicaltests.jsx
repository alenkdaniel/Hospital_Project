import { useEffect, useState, useCallback } from "react";

import { Link } from "react-router-dom";

import { motion } from "framer-motion";

import toast from "react-hot-toast";

import medicalTestService from "../../features/medicalTest/medicalTestService";

const EMPTY_FORM = {
  name: "",
  category: "",
  description: "",
  preparation: "",
  price: "",
};

// =====================================
// MANAGE MEDICAL TESTS
//
// Hospital Admin adds tests to the
// hospital's test catalog. Doctors then
// pick from this catalog while ordering
// tests during consultation.
// =====================================

const ManageMedicalTests = () => {
  const [tests, setTests] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [form, setForm] = useState(EMPTY_FORM);

  const [editingId, setEditingId] = useState(null);

  const [showForm, setShowForm] = useState(false);

  // "active" = normal catalog, "inactive" = removed
  // tests, so a hospital admin can restore one that
  // was removed by mistake.

  const [statusTab, setStatusTab] = useState("active");

  // =====================================
  // LOAD TESTS
  // =====================================

  const loadTests = useCallback(async (keyword = "", status = "active") => {
    setLoading(true);

    try {
      const response = await medicalTestService.getMedicalTests({
        search: keyword,
        status,
        limit: 100,
      });

      setTests(response.medicalTests || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load tests",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTests(search.trim(), statusTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusTab]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTests(search.trim(), statusTab);
    }, 350);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

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

  const openEditForm = (test) => {
    setForm({
      name: test.name || "",
      category: test.category || "",
      description: test.description || "",
      preparation: test.preparation || "",
      price: test.price ?? "",
    });

    setEditingId(test._id);
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
      toast.error("Test name is required");
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        await medicalTestService.updateMedicalTest(editingId, form);
        toast.success("Test updated successfully");
      } else {
        await medicalTestService.createMedicalTest(form);
        toast.success("Test added successfully");
      }

      closeForm();
      loadTests(search.trim(), statusTab);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          (editingId ? "Failed to update test" : "Failed to add test"),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (test) => {
    if (!window.confirm(`Remove "${test.name}" from the catalog?`)) {
      return;
    }

    try {
      await medicalTestService.deleteMedicalTest(test._id);
      toast.success("Test removed");
      loadTests(search.trim(), statusTab);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to remove test",
      );
    }
  };

  const handleRestore = async (test) => {
    try {
      await medicalTestService.updateMedicalTest(test._id, {
        isActive: true,
      });
      toast.success("Test restored");
      loadTests(search.trim(), statusTab);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to restore test",
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
          <h1 className="text-4xl font-bold">🧪 Medical Test Catalog</h1>

          <p className="mt-3 text-blue-100">
            Add tests here so doctors can order them for patients during
            consultation.
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
            + Add Test
          </button>
        </div>
      </motion.div>

      {/* STATUS TABS */}

      <div className="mt-8 flex gap-3">
        <button
          onClick={() => setStatusTab("active")}
          className={`px-6 py-2 rounded-xl font-semibold ${
            statusTab === "active"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-600 border"
          }`}
        >
          Active
        </button>

        <button
          onClick={() => setStatusTab("inactive")}
          className={`px-6 py-2 rounded-xl font-semibold ${
            statusTab === "inactive"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-600 border"
          }`}
        >
          Removed
        </button>
      </div>

      {/* SEARCH */}

      <div className="mt-4 bg-white rounded-3xl shadow-lg p-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tests by name or category..."
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
              {editingId ? "Edit Test" : "Add New Test"}
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
                Test Name *
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Complete Blood Count"
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
                placeholder="e.g. Pathology"
                className="w-full bg-gray-100 rounded-xl p-3 outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-2">
                Price
              </label>

              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 500"
                className="w-full bg-gray-100 rounded-xl p-3 outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-2">
                Preparation
              </label>

              <input
                name="preparation"
                value={form.preparation}
                onChange={handleChange}
                placeholder="e.g. Fasting for 8 hours"
                className="w-full bg-gray-100 rounded-xl p-3 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-semibold text-gray-700 block mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Short description of the test"
                rows={3}
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
                  ? "Update Test"
                  : "Add Test"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* TEST LIST */}

      <div className="mt-8 bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {tests.length}{" "}
          {statusTab === "inactive" ? "Removed " : ""}
          Test{tests.length === 1 ? "" : "s"}
        </h2>

        {loading && <p className="text-gray-400">Loading tests...</p>}

        {!loading && tests.length === 0 && (
          <p className="text-gray-400">
            {statusTab === "inactive"
              ? "No removed tests."
              : 'No tests found. Click "Add Test" to create your first entry.'}
          </p>
        )}

        <div className="space-y-3">
          {tests.map((test) => (
            <div
              key={test._id}
              className="bg-gray-50 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div>
                <h3 className="font-bold text-gray-800">
                  {test.name}

                  {test.price !== undefined && test.price !== null && (
                    <span className="text-gray-400 font-normal">
                      {" "}
                      &middot; ₹{test.price}
                    </span>
                  )}

                  {test.category && (
                    <span className="ml-2 text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      {test.category}
                    </span>
                  )}
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  {[test.preparation, test.description]
                    .filter(Boolean)
                    .join(" · ") || "No additional details"}
                </p>
              </div>

              <div className="flex gap-2 shrink-0">
                {statusTab === "active" ? (
                  <>
                    <button
                      onClick={() => openEditForm(test)}
                      className="px-4 py-2 rounded-lg font-semibold text-sm text-blue-600 hover:bg-blue-50 border border-blue-200"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(test)}
                      className="px-4 py-2 rounded-lg font-semibold text-sm text-red-600 hover:bg-red-50 border border-red-200"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleRestore(test)}
                    className="px-4 py-2 rounded-lg font-semibold text-sm text-green-600 hover:bg-green-50 border border-green-200"
                  >
                    Restore
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageMedicalTests;