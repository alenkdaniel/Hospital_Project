import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import {
  getMyAppointments,
  resetAppointment,
} from "../../features/appointment/appointmentSlice";

import { motion } from "framer-motion";

import toast from "react-hot-toast";

const MyAppointments = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const {
    appointments,

    isLoading,

    isError,

    message,
  } = useSelector((state) => state.appointment);

  // ======================================
  // LOAD APPOINTMENTS
  // ======================================

  useEffect(() => {
    dispatch(getMyAppointments());

    return () => {
      dispatch(resetAppointment());
    };
  }, [dispatch]);

  // ======================================
  // ERROR
  // ======================================

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  return (
    <div
      className="
min-h-screen
bg-gray-50
pt-28
px-6
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
p-12
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
          📅 My Appointments
        </h1>

        <p
          className="
mt-5
text-blue-100
text-lg
"
        >
          Track your hospital visits, doctors and payment status
        </p>
      </div>

      {/* LOADING */}

      {isLoading && (
        <p
          className="
text-center
text-xl
mt-20
"
        >
          Loading appointments...
        </p>
      )}

      {/* EMPTY */}

      {!isLoading && appointments.length === 0 && (
        <div
          className="
text-center
mt-24
text-gray-500
text-xl
"
        >
          No appointments found
        </div>
      )}

      {/* LIST */}

      <div
        className="
mt-16
space-y-8
pb-20
"
      >
        {appointments?.map((item) => (
          <motion.div
            key={item._id}
            whileHover={{ scale: 1.02 }}
            className="
bg-white
rounded-[35px]
shadow-xl
p-8
grid
md:grid-cols-4
gap-8
items-center
"
          >
            {/* DOCTOR */}

            <div>
              <h2
                className="
text-2xl
font-bold
"
              >
                👨‍⚕️ Dr. {item.doctor?.name}
              </h2>

              <p
                className="
text-blue-600
mt-2
font-semibold
"
              >
                {item.doctor?.specialization}
              </p>
            </div>

            {/* HOSPITAL */}
            <div>
              <p className="font-semibold">
                🏥 Hospital
              </p>

              <p className="text-gray-500 mt-2">
                {item.hospital?.name}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Appointment No: {item.booking?.appointmentNumber}
              </p>
            </div>

            {/* DATE */}

            <div>
              <p>
                📆 {new Date(item.appointmentDate).toLocaleDateString()}
              </p>

              <p className="mt-2">
                ⏰ {item.slot?.start} - {item.slot?.end}
              </p>

              <p className="mt-2">
                🎫 Token: {item.queue?.tokenNumber}
              </p>

              <p className="mt-2">
                ⏳ {item.queue?.estimatedWaitingTime} mins
              </p>
            </div>

            {/* STATUS */}

            <div
              className="
space-y-3
"
            >
              <span
                className={`
inline-block
px-5
py-2
rounded-full
font-semibold


${item.status === "confirmed"
                    ? "bg-green-100 text-green-600"
                    : item.status === "cancelled"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-600"
                  }

`}
              >
                {item.status}
              </span>

              <div>
                <span
                  className={`
inline-block
px-5
py-2
rounded-full
font-semibold

${item.payment?.status === "paid"
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-600"
                    }


`}
                >
                  💳 {item.payment?.status}
                </span>
              </div>

              <button
                onClick={() => navigate(`/appointments/${item._id}`)}
                className="
w-full
bg-blue-600
hover:bg-blue-700
text-white
py-3
rounded-xl
font-semibold
transition
"
              >
                View Details
              </button>


            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
