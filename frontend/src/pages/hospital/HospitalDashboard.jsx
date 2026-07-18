import { useEffect } from "react";

import { Link } from "react-router-dom";

import { motion } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";

import { getMyHospital } from "../../features/hospital/hospitalSlice";

import { getMyDoctors } from "../../features/doctor/doctorSlice";

import { getHospitalAppointments } from "../../features/appointment/appointmentSlice";

import toast from "react-hot-toast";

const HospitalAdminDashboard = () => {
  const dispatch = useDispatch();

  const {
    hospital,

    isLoading,

    isError,

    message,
  } = useSelector((state) => state.hospital);

  // const { doctors } = useSelector((state) => state.doctor);

  const { myDoctors } = useSelector((state) => state.doctor);

  const { hospitalAppointments } = useSelector(
    (state) => state.appointment
  );

  // ===============================
  // LOAD DATA
  // ===============================

  useEffect(() => {
    dispatch(getMyHospital());

    dispatch(getMyDoctors());

    dispatch(getHospitalAppointments());

  }, [dispatch]);

  // ===============================
  // ERROR
  // ===============================

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  // ===============================
  // LOADING
  // ===============================

  if (isLoading) {
    return (
      <div
        className="
pt-32
text-center
text-2xl
font-bold
"
      >
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div
      className="
min-h-screen
pt-28
px-10
bg-gray-50
"
    >
      {/* HEADER */}

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="
bg-gradient-to-r
from-blue-600
to-cyan-500
rounded-3xl
p-10
text-white
shadow-xl
"
      >
        <h1
          className="
text-4xl
font-bold
"
        >
          {hospital
            ? `Welcome back, ${hospital.name} 👋`
            : "Setup Your Hospital Profile 🏥"}
        </h1>

        <p
          className="
mt-3
text-blue-100
"
        >
          {hospital
            ? "Manage your doctors, appointments and hospital"
            : "Create hospital profile to continue"}
        </p>
      </motion.div>

      {hospital ? (
        <>
          {/* HOSPITAL INFO */}

          <div
            className="
mt-10
bg-white
rounded-3xl
shadow-lg
p-10
"
          >
            <h2
              className="
text-3xl
font-bold
"
            >
              🏥 {hospital.name}
            </h2>

            <p
              className="
text-gray-500
mt-3
"
            >
              📍 {hospital.address?.city},{hospital.address?.state}
            </p>

            <p
              className="
mt-4
font-semibold
"
            >
              Status :
              <span
                className={
                  hospital.verification?.status === "approved"
                    ? "text-green-600"
                    : "text-orange-500"
                }
              >
                {" "}
                {hospital.verification?.status}
              </span>
            </p>
          </div>

          {/* CARDS */}

          <div
            className="
grid
md:grid-cols-4
gap-8
mt-10
"
          >
            {[
              ["🏥", "Hospitals", 1],

              // ["👨‍⚕️", "Doctors", doctors?.length || 0],

              ["👨‍⚕️", "Doctors", myDoctors?.length || 0],

              ["📅", "Appointments", hospitalAppointments?.length || 0],

              ["⭐", "Rating", hospital.rating?.average || 0],
            ].map((item, index) => (
              <div
                key={index}
                className="
bg-white
rounded-3xl
p-8
shadow-lg
"
              >
                <div className="text-5xl">{item[0]}</div>

                <h2
                  className="
mt-4
font-bold
text-xl
"
                >
                  {item[1]}
                </h2>

                <p
                  className="
text-blue-600
text-3xl
font-bold
"
                >
                  {item[2]}
                </p>
              </div>
            ))}
          </div>

          {/* ACTION */}

          <div
            className="
mt-12
bg-white
rounded-3xl
shadow-lg
p-10
space-x-5
"
          >
            <h2
              className="
text-2xl
font-bold
mb-6
"
            >
              Quick Actions
            </h2>

            <Link
              to="/hospital/add-doctor"
              className="
inline-block
bg-green-600
text-white
px-8
py-4
rounded-xl
"
            >
              + Add Doctor
            </Link>

            <Link
              to="/hospital/appointments"
              className="
inline-block
bg-blue-600
text-white
px-8
py-4
rounded-xl
"
            >
              Appointments
            </Link>
          </div>
        </>
      ) : (
        <div
          className="
mt-12
bg-white
rounded-3xl
shadow-lg
p-10
text-center
"
        >
          <h2
            className="
text-3xl
font-bold
"
          >
            No Hospital Added
          </h2>

          <p
            className="
text-gray-500
mt-3
"
          >
            Create your hospital profile first
          </p>

          <Link
            to="/hospital/add-hospital"
            className="
inline-block
mt-8
bg-blue-600
text-white
px-8
py-4
rounded-xl
"
          >
            Setup Hospital
          </Link>
        </div>
      )}
    </div>
  );
};

export default HospitalAdminDashboard;
