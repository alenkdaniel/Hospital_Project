import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";

import { getDoctors, resetDoctor } from "../../features/doctor/doctorSlice";

const Doctors = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const {
    doctors,

    isLoading,

    isError,

    message,
  } = useSelector((state) => state.doctor);

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
  // ERROR
  // =====================================

  if (isError) {
    return (
      <div
        className="
pt-32
text-center
text-red-500
text-xl
"
      >
        {message}
      </div>
    );
  }

  return (
    <div
      className="
min-h-screen
bg-gray-50
pt-28
px-10
md:px-24
"
    >
      {/* HEADER */}

      <div
        className="
bg-gradient-to-r
from-blue-600
to-cyan-500
rounded-[40px]
p-14
text-white
shadow-xl
"
      >
        <h1
          className="
text-5xl
font-bold
"
        >
          👨‍⚕️ Our Medical Experts
        </h1>

        <p
          className="
mt-5
text-blue-100
text-lg
"
        >
          Find experienced doctors from verified hospitals
        </p>
      </div>

      {/* LOADING */}

      {isLoading && (
        <p
          className="
text-center
mt-16
text-xl
"
        >
          Loading Doctors...
        </p>
      )}

      {/* DOCTOR LIST */}

      <div
        className="
grid
md:grid-cols-3
gap-10
mt-16
pb-20
"
      >
        {doctors?.map((doctor) => (
          <motion.div
            whileHover={{ y: -10 }}
            key={doctor._id}
            className="
bg-white
rounded-[35px]
shadow-xl
overflow-hidden
"
          >
            <img
              src={
                doctor.image ||
                "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1200"
              }
              alt={doctor.name}
              className="
h-72
w-full
object-cover
"
            />

            <div className="p-8">
              <h2
                className="
text-2xl
font-bold
"
              >
                Dr. {doctor.name}
              </h2>

              <p
                className="
text-blue-600
font-semibold
mt-3
"
              >
                🩺 {doctor.specialization}
              </p>

              <p
                className="
text-gray-500
mt-3
"
              >
                🎓 {doctor.qualification}
              </p>

              <p
                className="
text-gray-500
mt-3
"
              >
                ⭐ {doctor.experience} Years Experience
              </p>

              <p
                className="
text-gray-500
mt-3
"
              >
                🏥 {doctor.hospital?.name || "Hospital"}
              </p>

              <p
                className="
text-green-600
font-semibold
mt-3
"
              >
                ₹ {doctor.consultationFee} Consultation
              </p>

              <button
                onClick={() => navigate(`/book-appointment/${doctor._id}`)}
                className="
mt-8
w-full
bg-blue-600
text-white
py-3
rounded-xl
hover:bg-blue-700
"
              >
                Book Appointment
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Doctors;
