import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getDoctors, resetDoctor } from "../../features/doctor/doctorSlice";
import {
  Star,
  Search,
  Filter,
  ChevronDown,
  X,
  MapPin,
  Clock,
  Award,
  DollarSign,
  Users,
  ThumbsUp,
  Zap,
  Calendar,
  Video,
  Stethoscope,
} from "lucide-react";

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
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Derived State
  const ITEMS_PER_PAGE = 12;
  const isFirstRender = useRef(true);

  // =====================================
  // LOAD DOCTORS
  // =====================================

  useEffect(() => {
    dispatch(getDoctors());

    return () => {
      dispatch(resetDoctor());
    };
  }, [dispatch]);

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

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSpecialization, minExperience, maxFee, selectedHospital]);

  // =====================================
  // ERROR HANDLING
  // =====================================

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 mb-2">Error</p>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    );
  }

  // =====================================
  // RENDER
  // =====================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      {/* HERO SECTION */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-blue-900 via-blue-600 to-cyan-500 text-white py-16 md:py-24 relative overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full"
          ></motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/5 rounded-full"
          ></motion.div>
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Our Medical Experts
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Connect with experienced doctors, read patient reviews, and book
              appointments seamlessly
            </p>
          </motion.div>

          {/* SEARCH BAR */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 max-w-2xl mx-auto"
          >
            <div className="flex gap-3 bg-white/20 backdrop-blur-sm rounded-2xl p-2 border border-white/30">
              <Search size={24} className="text-white/60 ml-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by doctor name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-white/60 outline-none"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        
        {/* FILTERS & SORT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-4"
        >
          {/* Filter Toggle & Results Count */}
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm"
            >
              <Zap size={18} className="text-gray-600" />
              <span className="font-medium text-gray-700">Filters</span>
              <ChevronDown
                size={16}
                className={`text-gray-600 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>

            <div className="text-gray-700 font-semibold">
              <span className="text-blue-600">{filteredDoctors.length}</span>
              {" "}Doctors found
            </div>

            {/* Sort Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm">
                <span className="font-medium text-gray-700">Sort: {sortBy === "rating" ? "Rating" : sortBy === "experience" ? "Experience" : "Fee"}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {["rating", "experience", "fee"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setSortBy(option)}
                    className={`block w-full text-left px-4 py-2.5 transition ${
                      sortBy === option
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {option === "rating" && "⭐ Rating"}
                    {option === "experience" && "📚 Experience"}
                    {option === "fee" && "💰 Fee (Low to High)"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FILTER PANEL */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Specialization Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Specialization
                    </label>
                    <select
                      value={selectedSpecialization}
                      onChange={(e) => setSelectedSpecialization(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 hover:border-blue-400 transition"
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
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Experience: {minExperience}+ years
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={minExperience}
                      onChange={(e) => setMinExperience(Number(e.target.value))}
                      className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  {/* Consultation Fee Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Max Fee: ₹{maxFee}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="500"
                      value={maxFee}
                      onChange={(e) => setMaxFee(Number(e.target.value))}
                      className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  {/* Hospital Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Hospital
                    </label>
                    <select
                      value={selectedHospital}
                      onChange={(e) => setSelectedHospital(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 hover:border-blue-400 transition"
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
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedSpecialization("all");
                      setMinExperience(0);
                      setMaxFee(10000);
                      setSelectedHospital("all");
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 transition font-medium"
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
          <div className="flex justify-center items-center py-24">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Loading Doctors...</p>
            </div>
          </div>
        )}

        {/* NO RESULTS */}
        {!isLoading && filteredDoctors.length === 0 && (
          <div className="text-center py-24">
            <p className="text-2xl font-bold text-gray-900 mb-2">
              No doctors found
            </p>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        )}

        {/* DOCTORS GRID */}
        {!isLoading && filteredDoctors.length > 0 && (
          <>
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
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
              <div className="flex justify-center gap-2 mb-8">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  ←
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const page = idx + 1;
                  const isActive = currentPage === page;
                  const isNear = Math.abs(page - currentPage) <= 1;

                  if (!isNear && page !== 1 && page !== totalPages) return null;

                  if (page !== 1 && !isNear && totalPages > 3) {
                    if (idx === 1)
                      return (
                        <span key="dots" className="px-2 text-gray-600">
                          ...
                        </span>
                      );
                    return null;
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-semibold transition ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  →
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
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100">
        <img
          src={
            doctor.image ||
            "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=600"
          }
          alt={doctor.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition"></div>

        {/* Specialization Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-blue-600">
          {doctor.specialization}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-yellow-400 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg">
          <Star size={12} className="fill-white" />
          {rating.toFixed(1)}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900">Dr. {doctor.name}</h3>

        {/* Doctor Info */}
        <div className="mt-3 space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Stethoscope size={16} className="text-blue-600" />
            <span>{doctor.qualification || "MBBS, MD"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award size={16} className="text-blue-600" />
            <span>{doctor.experience} years experience</span>
          </div>
          {doctor.hospital?.name && (
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-blue-600" />
              <span className="truncate">{doctor.hospital.name}</span>
            </div>
          )}
        </div>

        {/* Rating & Reviews */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <Users size={14} className="text-gray-500" />
              <span className="text-sm text-gray-600">
                {reviewCount} reviews
              </span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp size={14} className="text-gray-500" />
              <span className="text-sm text-gray-600">95% match</span>
            </div>
          </div>

          {/* Fee */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              <DollarSign size={16} className="text-green-600" />
              <span className="font-semibold text-gray-900">
                ₹{doctor.consultationFee}
              </span>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                Video Call
              </span>
              <span className="px-2 py-1 bg-green-50 text-green-600 rounded-full">
                In-person
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                navigate(`/book-appointment/${doctor._id}`)
              }
              className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg transition"
            >
              Book Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSelect}
              className="flex-1 py-2.5 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition z-10"
        >
          <X size={24} />
        </button>

        {/* Header Image */}
        <div className="relative h-64 bg-gradient-to-br from-blue-400 to-cyan-500">
          <img
            src={
              doctor.image ||
              "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800"
            }
            alt={doctor.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Dr. {doctor.name}
              </h2>
              <p className="text-blue-600 font-semibold mt-1">
                {doctor.specialization}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-lg">
              <Star size={20} className="fill-yellow-400 text-yellow-400" />
              <div>
                <p className="font-bold text-gray-900">
                  {(doctor.rating?.average || 4.5).toFixed(1)}
                </p>
                <p className="text-xs text-gray-600">
                  {doctor.rating?.count || 0} reviews
                </p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-bold text-gray-900 mb-3">Experience</h4>
              <p className="text-gray-600">
                {doctor.experience} years of medical practice
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-3">Qualification</h4>
              <p className="text-gray-600">{doctor.qualification}</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-3">Consultation Fee</h4>
              <p className="text-2xl font-bold text-green-600">
                ₹{doctor.consultationFee}
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-3">Hospital</h4>
              <p className="text-gray-600">{doctor.hospital?.name}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <Calendar size={20} />
              Book Appointment
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 py-3 border-2 border-blue-600 text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2"
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