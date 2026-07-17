import { useEffect } from "react";

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

const HospitalDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const {
    hospital,

    isLoading,
  } = useSelector((state) => state.hospital);

  const { doctors } = useSelector((state) => state.doctor);

  // ================================
  // LOAD DATA
  // ================================

  useEffect(() => {
    dispatch(getHospitalById(id));

    dispatch(getDoctorsByHospital(id));

    return () => {
      dispatch(resetHospital());

      dispatch(resetDoctor());
    };
  }, [id, dispatch]);

  if (isLoading || !hospital) {
    return (
      <h1
        className="
pt-32
text-center
text-2xl
"
      >
        Loading...
      </h1>
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
      {/* HOSPITAL HEADER */}

      <section
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
          🏥 {hospital.name}
        </h1>

        <p className="mt-5 text-xl">
          📍 {hospital.address?.city},{hospital.address?.state}
        </p>

        <p
          className="
mt-6
max-w-3xl
text-blue-100
"
        >
          {hospital.description}
        </p>
      </section>

      {/* INFO SECTION */}

      <section
        className="
grid
md:grid-cols-2
gap-10
mt-16
"
      >
        <div
          className="
bg-white
rounded-3xl
shadow-xl
p-10
"
        >
          <h2
            className="
text-3xl
font-bold
"
          >
            About Hospital
          </h2>

          <div
            className="
mt-8
space-y-5
text-gray-600
"
          >
            <p>📧 Email :{hospital.contact?.email}</p>

            <p>☎ Phone :{hospital.contact?.phone}</p>

            <p>📍 Address :{hospital.address?.street}</p>

            <p>
              🚑 Emergency :
              {hospital.emergency?.available ? " Available" : " Not Available"}
            </p>
          </div>
        </div>

        {/* STATS */}

        <div
          className="
grid
grid-cols-2
gap-6
"
        >
          {[
            ["👨‍⚕️", doctors?.length || 0, "Doctors"],

            ["⭐", hospital.rating?.average || 0, "Rating"],

            ["🛏", hospital.beds?.total || 0, "Beds"],

            ["🚑", "24/7", "Support"],
          ].map((item, index) => (
            <div
              key={index}
              className="
bg-white
rounded-3xl
shadow-xl
p-8
text-center
"
            >
              <div className="text-4xl">{item[0]}</div>

              <h2
                className="
text-3xl
font-bold
text-blue-600
mt-4
"
              >
                {item[1]}
              </h2>

              <p className="text-gray-500">{item[2]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FACILITIES */}

      <section
        className="
mt-20
bg-white
rounded-3xl
shadow-xl
p-10
"
      >
        <h2
          className="
text-3xl
font-bold
mb-8
"
        >
          🏥 Facilities
        </h2>

        <div
          className="
flex
gap-5
flex-wrap
"
        >
          {hospital.facilities?.map((item) => (
            <span
              key={item}
              className="
bg-blue-100
text-blue-600
px-6
py-3
rounded-xl
font-semibold
"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* DOCTORS */}

      <section
        className="
mt-24
pb-20
"
      >
        <h2
          className="
text-4xl
font-bold
mb-12
"
        >
          👨‍⚕️ Our Specialists
        </h2>

        <div
          className="
grid
md:grid-cols-3
gap-10
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
                <h3
                  className="
text-2xl
font-bold
"
                >
                  Dr. {doctor.name}
                </h3>

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
                  ⭐ {doctor.experience} Years Experience
                </p>

                <button
                  onClick={() => navigate(`/book-appointment/${doctor._id}`)}
                  className="
mt-8
bg-blue-600
text-white
w-full
py-3
rounded-xl
"
                >
                  Book Appointment
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HospitalDetails;
