import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getDoctors, resetDoctor } from "../../features/doctor/doctorSlice";
import {
  Star,
  Search,
  MapPin,
  Award,
  IndianRupee,
  Calendar,
  Video,
  Stethoscope,
  ArrowRight,
  ArrowLeft,
  X,
  ChevronDown,
  ChevronUp,
  BadgeCheck,
  Briefcase,
} from "lucide-react";

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "rating", label: "Highest Rated" },
  { value: "experience", label: "Most Experienced" },
  { value: "fee", label: "Fee: Low to High" },
];

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// A doctor is "available" within a window of days if any day in that
// window (starting today) has a working entry in their weekly schedule.
// Doctors without a schedule on file are never excluded by this filter.
const isAvailableWithinDays = (doctor, days) => {
  if (!doctor.weeklySchedule?.length) return true;

  const today = new Date();

  for (let i = 0; i <= days; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);

    const dayName = DAY_NAMES[d.getDay()];
    const entry = doctor.weeklySchedule.find((s) => s.day === dayName);

    if (entry?.isWorking) return true;
  }

  return false;
};

const ITEMS_PER_PAGE = 6;

const Doctors = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { doctors, isLoading, isError, message } = useSelector(
    (state) => state.doctor
  );

  // Search
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");

  // Filters
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [availability, setAvailability] = useState("anytime");
  const [minRating, setMinRating] = useState(0);
  const [showAllSpecialties, setShowAllSpecialties] = useState(false);

  const [sortBy, setSortBy] = useState("recommended");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // =====================================
  // LOAD DOCTORS
  // =====================================

  useEffect(() => {
    dispatch(getDoctors());

    return () => {
      dispatch(resetDoctor());
    };
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, locationTerm, selectedDepartment, availability, minRating, sortBy]);

  // =====================================
  // SPECIALTY LIST (with counts, from the full unfiltered list)
  // =====================================

  const specialtyCounts = useMemo(() => {
    const counts = {};

    (doctors || []).forEach((doctor) => {
      const key = doctor.department || doctor.specialization;
      if (!key) return;
      counts[key] = (counts[key] || 0) + 1;
    });

    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [doctors]);

  const visibleSpecialties = showAllSpecialties
    ? specialtyCounts
    : specialtyCounts.slice(0, 4);

  // =====================================
  // FILTER + SORT
  // =====================================

  const filteredDoctors = useMemo(() => {
    const list = (doctors || []).filter((doctor) => {
      const haystack = `${doctor.name} ${doctor.specialization} ${doctor.department}`.toLowerCase();
      const matchesSearch =
        !searchTerm || haystack.includes(searchTerm.toLowerCase());

      const addr = doctor.hospital?.address;
      const locationHaystack = `${addr?.city || ""} ${addr?.state || ""} ${addr?.pincode || ""}`.toLowerCase();
      const matchesLocation =
        !locationTerm || locationHaystack.includes(locationTerm.toLowerCase());

      const matchesDepartment =
        selectedDepartment === "all" ||
        (doctor.department || doctor.specialization) === selectedDepartment;

      const matchesAvailability =
        availability === "anytime" ||
        isAvailableWithinDays(doctor, availability === "today" ? 0 : 2);

      const matchesRating = (doctor.rating?.average || 0) >= minRating;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesDepartment &&
        matchesAvailability &&
        matchesRating
      );
    });

    return [...list].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating?.average || 0) - (a.rating?.average || 0);
        case "experience":
          return b.experience - a.experience;
        case "fee":
          return a.consultationFee - b.consultationFee;
        default:
          return (b.rating?.average || 0) - (a.rating?.average || 0);
      }
    });
  }, [doctors, searchTerm, locationTerm, selectedDepartment, availability, minRating, sortBy]);

  const totalPages = Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE);
  const paginatedDoctors = filteredDoctors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const hasActiveFilters =
    selectedDepartment !== "all" || availability !== "anytime" || minRating !== 0;

  const clearAll = () => {
    setSelectedDepartment("all");
    setAvailability("anytime");
    setMinRating(0);
  };

  const resultsLabel =
    selectedDepartment !== "all" ? ` for ${selectedDepartment}` : "";

  // =====================================
  // ERROR HANDLING
  // =====================================

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4">
        <div className="text-center">
          <p className="mb-2 text-2xl font-bold text-ink-900">
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
      {/* HERO / SEARCH */}
      <section className="bg-ink-50">
        <div className="mx-auto max-w-7xl px-6 pb-10 pt-12 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-ink-900 md:text-5xl">
            Find a Doctor
          </h1>
          <p className="mt-3 text-lg text-ink-500">
            Search our network of world-class specialists and book an
            appointment directly.
          </p>

          <div className="mt-8 grid gap-3 rounded-3xl border border-ink-100 bg-white p-3 shadow-sm lg:grid-cols-[1.4fr_1fr_auto]">
            {/* Condition / doctor search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
              />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Condition, procedure, doctor name..."
                className="h-14 w-full rounded-2xl border border-transparent bg-ink-50 pl-11 pr-4 text-sm outline-none transition focus:border-brand-600 focus:bg-white"
              />
            </div>

            {/* Location */}
            <div className="relative">
              <MapPin
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
              />
              <input
                value={locationTerm}
                onChange={(e) => setLocationTerm(e.target.value)}
                placeholder="City, state, or zip code"
                className="h-14 w-full rounded-2xl border border-transparent bg-ink-50 pl-11 pr-4 text-sm outline-none transition focus:border-brand-600 focus:bg-white"
              />
            </div>

            {/* Search button */}
            <button
              onClick={() => setCurrentPage(1)}
              className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-brand-800 px-8 text-sm font-semibold text-white transition hover:bg-brand-900"
            >
              Search Doctors
            </button>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="px-6 pb-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[300px_1fr]">
          {/* SIDEBAR FILTERS */}
          <aside className="h-fit rounded-3xl border border-ink-100 bg-white p-7 shadow-sm lg:sticky lg:top-28">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-ink-900">Filters</h2>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-sm font-semibold text-brand-700 transition hover:text-brand-900"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Specialty */}
            <div className="border-b border-ink-100 py-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-ink-500">
                Specialty
              </h3>

              <div className="space-y-3">
                <label className="flex cursor-pointer items-center gap-3 text-sm text-ink-700">
                  <input
                    type="checkbox"
                    checked={selectedDepartment === "all"}
                    onChange={() => setSelectedDepartment("all")}
                    className="h-5 w-5 rounded accent-brand-700"
                  />
                  <span>All specialties</span>
                </label>

                {visibleSpecialties.map(([name, count]) => (
                  <label
                    key={name}
                    className="flex cursor-pointer items-center gap-3 text-sm text-ink-700"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDepartment === name}
                      onChange={() =>
                        setSelectedDepartment(
                          selectedDepartment === name ? "all" : name
                        )
                      }
                      className="h-5 w-5 rounded accent-brand-700"
                    />
                    <span>
                      {name} <span className="text-ink-400">({count})</span>
                    </span>
                  </label>
                ))}
              </div>

              {specialtyCounts.length > 4 && (
                <button
                  type="button"
                  onClick={() => setShowAllSpecialties((s) => !s)}
                  className="mt-4 flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-900"
                >
                  {showAllSpecialties ? (
                    <>
                      Show less <ChevronUp size={15} />
                    </>
                  ) : (
                    <>
                      + View more <ChevronDown size={15} />
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Availability */}
            <div className="border-b border-ink-100 py-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-ink-500">
                Availability
              </h3>

              <div className="space-y-3">
                {[
                  { value: "today", label: "Today" },
                  { value: "3days", label: "Within 3 Days" },
                  { value: "anytime", label: "Anytime" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className="flex cursor-pointer items-center gap-3 text-sm text-ink-700"
                  >
                    <input
                      type="radio"
                      checked={availability === opt.value}
                      onChange={() => setAvailability(opt.value)}
                      className="h-5 w-5 accent-brand-700"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Patient Rating */}
            <div className="pt-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-ink-500">
                Patient Rating
              </h3>

              <div className="space-y-3">
                {[
                  { value: 4.8, label: "5.0" },
                  { value: 4, label: "4.0 & Up" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className="flex cursor-pointer items-center gap-3 text-sm text-ink-700"
                  >
                    <input
                      type="checkbox"
                      checked={minRating === opt.value}
                      onChange={() =>
                        setMinRating(minRating === opt.value ? 0 : opt.value)
                      }
                      className="h-5 w-5 rounded accent-brand-700"
                    />
                    <span className="flex items-center gap-1.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < Math.round(opt.value)
                              ? "fill-amber-400 text-amber-400"
                              : "text-ink-200"
                          }
                        />
                      ))}
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* RIGHT SIDE */}
          <div>
            {/* Results header */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-ink-600">
                Showing{" "}
                <span className="font-semibold text-ink-900">
                  {filteredDoctors.length}
                </span>{" "}
                results{resultsLabel}
              </p>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-ink-500">
                  Sort by:
                </span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-11 cursor-pointer appearance-none rounded-xl border border-ink-200 bg-white pl-4 pr-10 text-sm font-medium text-ink-800 outline-none transition focus:border-brand-600"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400"
                  />
                </div>
              </div>
            </div>

            {/* LOADING STATE */}
            {isLoading && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="h-56 animate-pulse rounded-[22px] border border-ink-100 bg-white"
                  />
                ))}
              </div>
            )}

            {/* NO RESULTS */}
            {!isLoading && filteredDoctors.length === 0 && (
              <div className="flex flex-col items-center rounded-[22px] border border-dashed border-ink-200 bg-white px-6 py-24 text-center">
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
                <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
                  {paginatedDoctors.map((doctor) => (
                    <DoctorCard
                      key={doctor._id}
                      doctor={doctor}
                      onSelect={() => setSelectedDoctor(doctor)}
                      onBook={() =>
                        navigate(`/book-appointment/${doctor._id}`)
                      }
                    />
                  ))}
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className="flex justify-center">
                    <div className="flex items-center gap-3">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-200 bg-white text-lg text-ink-600 transition hover:bg-ink-100 disabled:opacity-40"
                      >
                        <ArrowLeft size={16} />
                      </button>

                      {Array.from({ length: totalPages }).map((_, idx) => {
                        const page = idx + 1;

                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`flex h-11 w-11 items-center justify-center rounded-full border font-semibold transition ${
                              currentPage === page
                                ? "border-brand-800 bg-brand-800 text-white"
                                : "border-ink-200 bg-white text-ink-700 hover:bg-ink-100"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}

                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-200 bg-white text-lg text-ink-600 transition hover:bg-ink-100 disabled:opacity-40"
                      >
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* DOCTOR MODAL */}
      <AnimatePresence>
        {selectedDoctor && (
          <DoctorModal
            doctor={selectedDoctor}
            onClose={() => setSelectedDoctor(null)}
            onBook={() => {
              setSelectedDoctor(null);
              navigate(`/book-appointment/${selectedDoctor._id}`);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// =====================================
// DOCTOR CARD — horizontal layout
// =====================================

const DoctorCard = ({ doctor, onSelect, onBook }) => {
  const rating = doctor.rating?.average || 0;
  const reviewCount = doctor.rating?.count || 0;
  const isVerified = doctor.isAvailable !== false;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col rounded-[22px] border border-ink-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="flex items-start gap-4">
        <img
          src={
            doctor.image ||
            "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300"
          }
          alt={doctor.name}
          className="h-20 w-20 shrink-0 rounded-2xl object-cover"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-xl font-bold text-ink-900">
              Dr. {doctor.name}
            </h3>
            {isVerified && (
              <BadgeCheck
                size={18}
                className="shrink-0 fill-brand-600 text-white"
              />
            )}
          </div>

          <p className="mt-0.5 truncate text-sm text-ink-500">
            {doctor.specialization}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-600">
            <span className="flex items-center gap-1.5">
              <Briefcase size={14} className="text-ink-400" />
              {doctor.experience} Yrs Exp
            </span>
            <span className="flex items-center gap-1">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span className="font-semibold text-ink-900">
                {rating.toFixed(1)}
              </span>
              <span className="text-ink-400">({reviewCount} Reviews)</span>
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-ink-100 pt-5">
        <div className="flex items-center gap-1 text-sm font-semibold text-ink-900">
          <IndianRupee size={15} className="text-brand-700" />
          {doctor.consultationFee}
        </div>

        <div className="flex flex-1 gap-3">
          <button
            onClick={onSelect}
            className="flex h-11 flex-1 items-center justify-center rounded-xl border border-ink-200 bg-white text-sm font-semibold text-ink-700 transition hover:border-brand-600 hover:text-brand-700"
          >
            View Profile
          </button>
          <button
            onClick={onBook}
            className="flex h-11 flex-1 items-center justify-center rounded-xl bg-brand-800 text-sm font-semibold text-white transition hover:bg-brand-900"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// =====================================
// DOCTOR MODAL — full profile
// =====================================

const DoctorModal = ({ doctor, onClose, onBook }) => {
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
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-10 rounded-full bg-white/90 p-2 text-ink-600 shadow-md transition hover:bg-white hover:text-ink-900"
        >
          <X size={22} />
        </button>

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
                  {(doctor.rating?.average || 0).toFixed(1)}
                </p>
                <p className="text-xs text-ink-500">
                  {doctor.rating?.count || 0} reviews
                </p>
              </div>
            </div>
          </div>

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

          <div className="flex gap-4 border-t border-ink-100 pt-6">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onBook}
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