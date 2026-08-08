import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getDoctors, resetDoctor } from "../../features/doctor/doctorSlice";
import {
  Star,
  Search,
  SlidersHorizontal,
  ChevronDown,
  X,
  MapPin,
  Award,
  IndianRupee,
  Users,
  Calendar,
  Video,
  Stethoscope,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

const SORT_OPTIONS = [
  { value: "rating", label: "Highest Rated" },
  { value: "experience", label: "Most Experienced" },
  { value: "fee", label: "Fee: Low to High" },
];

const Doctors = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { doctors, isLoading, isError, message } = useSelector(
    (state) => state.doctor
  );

  // Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [minExperience, setMinExperience] = useState(0);
  const [maxFee, setMaxFee] = useState(10000);
  const [selectedHospital, setSelectedHospital] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Derived State
  const ITEMS_PER_PAGE = 12;
  const isFirstRender = useRef(true);
  const sortRef = useRef(null);

  // =====================================
  // LOAD DOCTORS
  // =====================================

  useEffect(() => {
    dispatch(getDoctors());

    return () => {
      dispatch(resetDoctor());
    };
  }, [dispatch]);

  // Close the sort dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // =====================================
  // FILTER & SORT LOGIC
  // =====================================

  const filteredDoctors = doctors
    ?.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSpecialization =
        selectedSpecialization === "all" ||
        doctor.specialization === selectedSpecialization;

      const matchesExperience = doctor.experience >= minExperience;

      const matchesFee = doctor.consultationFee <= maxFee;

      const matchesHospital =
        selectedHospital === "all" ||
        doctor.hospital?._id === selectedHospital;

      return (
        matchesSearch &&
        matchesSpecialization &&
        matchesExperience &&
        matchesFee &&
        matchesHospital
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating?.average || 0) - (a.rating?.average || 0);
        case "experience":
          return b.experience - a.experience;
        case "fee":
          return a.consultationFee - b.consultationFee;
        default:
          return 0;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE);
  const paginatedDoctors = filteredDoctors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Get unique values for filters
  const specializations = [
    "all",
    ...new Set(doctors?.map((d) => d.specialization)),
  ];
  const hospitals = [
    "all",
    ...new Set(doctors?.map((d) => d.hospital?._id)),
  ];

  const getHospitalName = (id) => {
    return doctors?.find((d) => d.hospital?._id === id)?.hospital?.name || id;
  };

  const activeFilterCount =
    (selectedSpecialization !== "all" ? 1 : 0) +
    (minExperience > 0 ? 1 : 0) +
    (maxFee < 10000 ? 1 : 0) +
    (selectedHospital !== "all" ? 1 : 0);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSpecialization, minExperience, maxFee, selectedHospital]);

  // =====================================
  // ERROR HANDLING
  // =====================================

  if (isError) {
    return (
      <div className="min-h-screen bg-ink-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-ink-900 mb-2">
            Something went wrong
          </p>
          <p className="text-ink-500">{message}</p>
        </div>
      </div>
    );
  }

  // =====================================
  // RENDER
  // =====================================

  return (
    <div className="min-h-screen bg-ink-50">
      {/* HERO SECTION */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600 py-20 pt-28 text-white md:py-28 md:pt-32"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -top-24 -right-24 h-96 w-96 rounded-full border border-white/10"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-white/5"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold">
              <Sparkles size={14} />
              {doctors?.length || 0}+ verified specialists
            </span>

            <h1 className="mt-5 text-4xl font-extrabold md:text-5xl">
              Find Your Medical Expert
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-brand-50/90">
              Connect with experienced doctors, read patient reviews, and book
              appointments seamlessly
            </p>
          </motion.div>

          {/* SEARCH BAR */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mx-auto mt-10 max-w-2xl"
          >
            <div className="flex items-center gap-3 rounded-2xl border border-white/25 bg-white/10 p-2 backdrop-blur-sm">
              <Search size={20} className="ml-3 flex-shrink-0 text-white/60" />
              <input
                type="text"
                placeholder="Search by doctor name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent py-2.5 text-white placeholder-white/60 outline-none"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* MAIN CONTENT */}
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8">

        {/* FILTERS & SORT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-4"
        >
          {/* Filter Toggle & Results Count */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 shadow-sm transition ${
                showFilters
                  ? "border-brand-600 bg-brand-50 text-brand-700"
                  : "border-ink-200 bg-white text-ink-700 hover:border-brand-200"
              }`}
            >
              <SlidersHorizontal size={17} />
              <span className="font-semibold">Filters</span>
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown
                size={16}
                className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </button>

            <div className="font-semibold text-ink-700">
              <span className="text-brand-700">{filteredDoctors.length}</span>{" "}
              doctors found
            </div>

            {/* Sort Dropdown */}
            <div className="relative ml-auto" ref={sortRef}>
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 shadow-sm transition ${
                  sortOpen
                    ? "border-brand-600 bg-brand-50 text-brand-700"
                    : "border-ink-200 bg-white text-ink-700 hover:border-brand-200"
                }`}
              >
                <span className="font-medium">
                  Sort: {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${sortOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 z-40 mt-2 w-52 overflow-hidden rounded-2xl border border-ink-100 bg-white p-1.5 shadow-xl"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setSortOpen(false);
                        }}
                        className={`block w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium transition ${
                          sortBy === option.value
                            ? "bg-brand-50 text-brand-700"
                            : "text-ink-600 hover:bg-ink-50"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* FILTER PANEL */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden rounded-2xl border border-ink-100 bg-white p-6 shadow-sm"
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {/* Specialization Filter */}
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-ink-900">
                      Specialization
                    </label>
                    <select
                      value={selectedSpecialization}
                      onChange={(e) => setSelectedSpecialization(e.target.value)}
                      className="w-full rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-ink-900 outline-none transition hover:border-brand-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                    >
                      {specializations.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec === "all" ? "All Specializations" : spec}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Experience Filter */}
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-ink-900">
                      Experience: {minExperience}+ years
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={minExperience}
                      onChange={(e) => setMinExperience(Number(e.target.value))}
                      className="w-full h-2 cursor-pointer appearance-none rounded-lg bg-ink-200 accent-brand-600"
                    />
                  </div>

                  {/* Consultation Fee Filter */}
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-ink-900">
                      Max Fee: ₹{maxFee}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="500"
                      value={maxFee}
                      onChange={(e) => setMaxFee(Number(e.target.value))}
                      className="w-full h-2 cursor-pointer appearance-none rounded-lg bg-ink-200 accent-brand-600"
                    />
                  </div>

                  {/* Hospital Filter */}
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-ink-900">
                      Hospital
                    </label>
                    <select
                      value={selectedHospital}
                      onChange={(e) => setSelectedHospital(e.target.value)}
                      className="w-full rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-ink-900 outline-none transition hover:border-brand-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                    >
                      {hospitals.map((hospital) => (
                        <option key={hospital} value={hospital}>
                          {hospital === "all"
                            ? "All Hospitals"
                            : getHospitalName(hospital)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="mt-5 flex justify-end border-t border-ink-100 pt-4">
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedSpecialization("all");
                      setMinExperience(0);
                      setMaxFee(10000);
                      setSelectedHospital("all");
                    }}
                    className="flex items-center gap-2 rounded-xl px-4 py-2 font-medium text-ink-500 transition hover:bg-rose-50 hover:text-rose-600"
                  >
                    <X size={16} />
                    Clear Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-96 animate-pulse rounded-[28px] border border-ink-100 bg-white"
              />
            ))}
          </div>
        )}

        {/* NO RESULTS */}
        {!isLoading && filteredDoctors.length === 0 && (
          <div className="flex flex-col items-center rounded-[28px] border border-dashed border-ink-200 bg-white px-6 py-24 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
              <Stethoscope size={28} className="text-brand-600" />
            </span>
            <p className="mt-5 text-xl font-bold text-ink-900">
              No doctors found
            </p>
            <p className="mt-2 text-ink-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* DOCTORS GRID */}
        {!isLoading && filteredDoctors.length > 0 && (
          <>
            <motion.div
              layout
              className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {paginatedDoctors.map((doctor, idx) => (
                <DoctorCard
                  key={doctor._id}
                  doctor={doctor}
                  index={idx}
                  onSelect={() => setSelectedDoctor(doctor)}
                />
              ))}
            </motion.div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="mb-8 flex justify-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink-200 text-ink-600 transition hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft size={16} />
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const page = idx + 1;
                  const isActive = currentPage === page;
                  const isNear = Math.abs(page - currentPage) <= 1;

                  if (!isNear && page !== 1 && page !== totalPages) return null;

                  if (page !== 1 && !isNear && totalPages > 3) {
                    if (idx === 1)
                      return (
                        <span key="dots" className="px-2 text-ink-400">
                          ...
                        </span>
                      );
                    return null;
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`h-10 w-10 rounded-xl font-semibold transition ${
                        isActive
                          ? "bg-brand-700 text-white shadow-md shadow-brand-700/20"
                          : "border border-ink-200 text-ink-600 hover:bg-ink-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink-200 text-ink-600 transition hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* DOCTOR MODAL */}
      <AnimatePresence>
        {selectedDoctor && (
          <DoctorModal
            doctor={selectedDoctor}
            onClose={() => setSelectedDoctor(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Doctor Card Component
const DoctorCard = ({ doctor, index, onSelect }) => {
  const navigate = useNavigate();
  const rating = doctor.rating?.average || 4.5;
  const reviewCount = doctor.rating?.count || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.06 }}
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-[28px] border border-ink-100 bg-white shadow-sm transition-shadow hover:shadow-xl"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-brand-100 to-brand-50">
        <img
          src={
            doctor.image ||
            "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=600"
          }
          alt={doctor.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition group-hover:opacity-100" />

        {/* Specialization Badge */}
        <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand-700 backdrop-blur-sm">
          {doctor.specialization}
        </div>

        {/* Rating Badge */}
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-amber-950 shadow-md">
          <Star size={12} className="fill-amber-950" />
          {rating.toFixed(1)}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-ink-900">Dr. {doctor.name}</h3>

        {/* Doctor Info */}
        <div className="mt-3 space-y-2 text-sm text-ink-600">
          <div className="flex items-center gap-2">
            <Stethoscope size={16} className="text-brand-600" />
            <span>{doctor.qualification || "MBBS, MD"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award size={16} className="text-brand-600" />
            <span>{doctor.experience} years experience</span>
          </div>
          {doctor.hospital?.name && (
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-brand-600" />
              <span className="truncate">{doctor.hospital.name}</span>
            </div>
          )}
        </div>

        {/* Rating & Reviews */}
        <div className="mt-4 border-t border-ink-100 pt-4">
          <div className="mb-3 flex items-center gap-1.5">
            <Users size={14} className="text-ink-400" />
            <span className="text-sm text-ink-500">
              {reviewCount} reviews
            </span>
          </div>

          {/* Fee */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              <IndianRupee size={16} className="text-brand-700" />
              <span className="font-bold text-ink-900">
                {doctor.consultationFee}
              </span>
              <span className="ml-1 text-xs text-ink-400">consultation</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/book-appointment/${doctor._id}`)}
              className="flex-1 rounded-xl bg-brand-700 py-2.5 font-semibold text-white shadow-md shadow-brand-700/20 transition hover:bg-brand-800"
            >
              Book Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSelect}
              className="flex-1 rounded-xl border-2 border-brand-600 py-2.5 font-semibold text-brand-700 transition hover:bg-brand-50"
            >
              View Profile
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Doctor Modal Component
const DoctorModal = ({ doctor, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-white"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-10 rounded-full bg-white/90 p-2 text-ink-600 shadow-md transition hover:bg-white hover:text-ink-900"
        >
          <X size={22} />
        </button>

        {/* Header Image */}
        <div className="relative h-64 bg-gradient-to-br from-brand-600 to-brand-400">
          <img
            src={
              doctor.image ||
              "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800"
            }
            alt={doctor.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-ink-900">
                Dr. {doctor.name}
              </h2>
              <p className="mt-1 font-semibold text-brand-700">
                {doctor.specialization}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-amber-50 px-4 py-2">
              <Star size={20} className="fill-amber-400 text-amber-400" />
              <div>
                <p className="font-bold text-ink-900">
                  {(doctor.rating?.average || 4.5).toFixed(1)}
                </p>
                <p className="text-xs text-ink-500">
                  {doctor.rating?.count || 0} reviews
                </p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="mb-6 grid gap-6 rounded-2xl bg-ink-50 p-6 md:grid-cols-2">
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
                Experience
              </h4>
              <p className="font-semibold text-ink-900">
                {doctor.experience} years of medical practice
              </p>
            </div>
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
                Qualification
              </h4>
              <p className="font-semibold text-ink-900">
                {doctor.qualification}
              </p>
            </div>
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
                Consultation Fee
              </h4>
              <p className="flex items-center text-2xl font-extrabold text-brand-700">
                <IndianRupee size={20} />
                {doctor.consultationFee}
              </p>
            </div>
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
                Hospital
              </h4>
              <p className="font-semibold text-ink-900">
                {doctor.hospital?.name}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 border-t border-ink-100 pt-6">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-700 py-3 font-bold text-white shadow-md shadow-brand-700/20 transition hover:bg-brand-800"
            >
              <Calendar size={20} />
              Book Appointment
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-brand-600 py-3 font-bold text-brand-700 transition hover:bg-brand-50"
            >
              <Video size={20} />
              Video Consultation
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Doctors;