import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  getHospitalById,
  resetHospital,
} from "../../features/hospital/hospitalSlice";
import {
  getDoctorsByHospital,
  resetDoctor,
} from "../../features/doctor/doctorSlice";
import { getHospitalReviews } from "../../features/review/reviewSlice";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Heart,
  Share2,
  Clock,
  Ambulance,
  Users,
  Award,
  ChevronRight,
  Calendar,
  Stethoscope,
} from "lucide-react";

const HospitalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { hospital, isLoading } = useSelector((state) => state.hospital);
  const { doctors } = useSelector((state) => state.doctor);
  const { hospitalReviews } = useSelector((state) => state.review);

  const [activeTab, setActiveTab] = useState("overview");
  const [isFavorite, setIsFavorite] = useState(false);
  const [displayedDoctors, setDisplayedDoctors] = useState(3);

  // ================================
  // LOAD DATA
  // ================================

  useEffect(() => {
    dispatch(getHospitalById(id));
    dispatch(getDoctorsByHospital(id));
    dispatch(getHospitalReviews({ hospitalId: id, params: { limit: 6 } }));

    return () => {
      dispatch(resetHospital());
      dispatch(resetDoctor());
    };
  }, [id, dispatch]);

  if (isLoading || !hospital) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading Hospital Details...</p>
        </div>
      </div>
    );
  }

  const rating = hospital.rating?.average || 0;
  const reviewCount = hospital.rating?.count || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO SECTION */}
      <div className="relative h-96 md:h-[500px] overflow-hidden bg-gradient-to-br from-blue-900 via-blue-600 to-cyan-500">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url(${
              hospital.images?.[0]?.url ||
              "https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=1600"
            })`,
          }}
        ></div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60"></div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-12">
          {/* Top Actions */}
          <div className="flex justify-between items-start">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white hover:bg-white/20 px-4 py-2 rounded-lg transition"
            >
              <ChevronRight size={20} className="rotate-180" />
              Back
            </button>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFavorite(!isFavorite)}
                className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition"
              >
                <Heart
                  size={24}
                  className={isFavorite ? "fill-red-500 text-red-500" : ""}
                />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition"
              >
                <Share2 size={24} />
              </motion.button>
            </div>
          </div>

          {/* Hospital Info */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              {hospital.name}
            </motion.h1>

            <div className="flex flex-wrap gap-6 text-white">
              <div className="flex items-center gap-2">
                <MapPin size={20} />
                <span>{hospital.address?.city}, {hospital.address?.state}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={20} className="fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{rating.toFixed(1)}</span>
                <span className="text-white/80">({reviewCount} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 -mt-20 relative z-20">
        
        {/* QUICK STATS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { icon: Users, label: "Doctors", value: doctors?.length || 0 },
            { icon: Ambulance, label: "Beds", value: hospital.beds?.total || 0 },
            { icon: Clock, label: "Emergency", value: "24/7" },
            { icon: Award, label: "Rating", value: `${rating.toFixed(1)}⭐` },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Icon size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* TABS */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {["overview", "facilities", "doctors", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 md:px-8 py-4 font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <div className="p-8 md:p-12">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    About {hospital.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {hospital.description || "No description available"}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-gray-900">Contact</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Phone
                          size={20}
                          className="text-blue-600 flex-shrink-0 mt-1"
                        />
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-semibold text-gray-900">
                            {hospital.contact?.phone || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Mail
                          size={20}
                          className="text-blue-600 flex-shrink-0 mt-1"
                        />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-semibold text-gray-900">
                            {hospital.contact?.email || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin
                          size={20}
                          className="text-blue-600 flex-shrink-0 mt-1"
                        />
                        <div>
                          <p className="text-sm text-gray-600">Address</p>
                          <p className="font-semibold text-gray-900">
                            {hospital.address?.street || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-gray-900">
                      Hospital Type
                    </h4>
                    <div className="space-y-3">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-600">Type</p>
                        <p className="font-semibold text-gray-900">
                          {hospital.type || "N/A"}
                        </p>
                      </div>
                      {hospital.emergency?.available && (
                        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                          <div className="flex items-center gap-2">
                            <Ambulance
                              size={20}
                              className="text-red-600"
                            />
                            <div>
                              <p className="text-sm text-gray-600">
                                Emergency Services
                              </p>
                              <p className="font-semibold text-red-600">
                                24/7 Available
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* FACILITIES TAB */}
            {activeTab === "facilities" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Hospital Facilities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hospital.facilities?.map((facility, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200"
                    >
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="font-semibold text-gray-900">
                        {facility}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* DOCTORS TAB */}
            {activeTab === "doctors" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Our Specialists
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {doctors?.slice(0, displayedDoctors).map((doctor) => (
                    <DoctorCard key={doctor._id} doctor={doctor} />
                  ))}
                </div>
                {doctors?.length > displayedDoctors && (
                  <div className="text-center mt-8">
                    <button
                      onClick={() => setDisplayedDoctors(doctors.length)}
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      View All Doctors ({doctors.length})
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === "reviews" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Patient Reviews
                </h3>
                {hospitalReviews.length === 0 ? (
                  <p className="text-gray-600 text-center py-12">
                    No reviews yet. Be the first to share your experience!
                  </p>
                ) : (
                  <div className="grid gap-6">
                    {hospitalReviews.map((review, idx) => (
                      <motion.div
                        key={review._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {review.patient?.name || "Verified Patient"}
                            </p>
                            <p className="text-sm text-gray-500">
                              Verified Review
                            </p>
                          </div>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={
                                  i < review.hospitalRating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          "{review.hospitalComment}"
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* CTA SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-8 md:p-12 text-white text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Book an Appointment Today
          </h2>
          <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
            Connect with our experienced specialists and get the care you need
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              navigate(`/book-appointment/${doctors?.[0]?._id || ""}`)
            }
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 transition"
          >
            <Calendar size={20} />
            Schedule Now
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

// Doctor Card Component
const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group"
    >
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={
            doctor.image ||
            "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=600"
          }
          alt={doctor.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900">Dr. {doctor.name}</h3>
        <p className="text-blue-600 font-semibold mt-2">{doctor.specialization}</p>
        <p className="text-gray-600 text-sm mt-1">
          {doctor.experience} years experience
        </p>

        <div className="flex items-center gap-2 mt-3">
          <Star size={16} className="fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-gray-900">4.5</span>
          <span className="text-gray-600 text-sm">(150+ reviews)</span>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3">
            ₹{doctor.consultationFee} Consultation Fee
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              navigate(`/book-appointment/${doctor._id}`)
            }
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg transition"
          >
            Book Appointment
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default HospitalDetails;