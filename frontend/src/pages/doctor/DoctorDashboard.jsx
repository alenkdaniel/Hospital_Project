import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  getDoctorAppointments,
  updateAppointmentStatus,
  resetAppointment,
} from "../../features/appointment/appointmentSlice";

import { motion } from "framer-motion";

import toast from "react-hot-toast";

const DoctorDashboard = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const {
    doctorAppointments,

    isLoading,

    isError,

    message,
  } = useSelector((state) => state.appointment);

  // =====================================
  // LOAD DOCTOR APPOINTMENTS
  // =====================================

  useEffect(() => {
    if (user?._id) {
      dispatch(getDoctorAppointments(user._id));
    }

    return () => {
      dispatch(resetAppointment());
    };
  }, [dispatch, user?._id]);

  // =====================================
  // ERROR HANDLING
  // =====================================

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  // =====================================
  // UPDATE STATUS
  // =====================================

  const handleStatus = async (id, status) => {
    try {
      await dispatch(
        updateAppointmentStatus({
          id,
          status,
        }),
      ).unwrap();

      toast.success("Appointment updated");
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : "Failed to update appointment"
      );
    }
  };

  return (
    <div
      className="
min-h-screen
bg-gray-50
pt-28
px-10
"
    >
      {/* HEADER */}

      <div
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
          👨‍⚕️ Doctor Dashboard
        </h1>

        <p
          className="
mt-3
text-blue-100
"
        >
          Manage patient appointments and consultations
        </p>
      </div>

      {/* STATS */}

      <div
        className="
grid
md:grid-cols-4
gap-8
mt-10
"
      >
        {[
          ["📅", "Appointments", doctorAppointments?.length || 0],

          [
            "⏳",

            "Pending",

            doctorAppointments?.filter((a) => a.status === "pending").length || 0,
          ],

          [
            "✅",

            "Completed",

            doctorAppointments?.filter((a) => a.status === "completed").length || 0,
          ],

          [
            "❌",

            "Cancelled",

            doctorAppointments?.filter((a) => a.status === "cancelled").length || 0,
          ],
        ].map((item, index) => (
          <div
            key={index}
            className="
bg-white
rounded-3xl
shadow-lg
p-8
"
          >
            <div
              className="
text-5xl
"
            >
              {item[0]}
            </div>

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

      {/* LOADING */}

      {isLoading && (
        <h2
          className="
text-center
mt-20
text-xl
"
        >
          Loading appointments...
        </h2>
      )}

      {!isLoading && doctorAppointments?.length === 0 && (
        <div className="text-center mt-20 text-xl text-gray-500">
          No appointments found.
        </div>
      )}

      {/* APPOINTMENTS */}

      <div
        className="
mt-12
space-y-8
pb-20
"
      >
        {doctorAppointments?.map((item) => (
          <motion.div
            key={item._id}
            whileHover={{ scale: 1.02 }}
            className="
bg-white
rounded-[30px]
shadow-xl
p-8
grid
md:grid-cols-5
gap-8
items-center
"
          >
            {/* PATIENT */}

            <div>
              <h2
                className="
text-xl
font-bold
"
              >
                👤 {item.patient?.name}
              </h2>

              <p
                className="
text-gray-500
mt-2
"
              >
                {item.patient?.email}
              </p>

              <p
                className="
text-gray-500
mt-2
text-sm
"
              >
                📋 {item.booking?.appointmentNumber}
              </p>

              <p
                className="
text-gray-500
mt-1
"
              >
                🎫 Token #{item.queue?.tokenNumber}
              </p>
            </div>

            {/* MEDICAL */}

            <div>
              <h3
                className="
font-bold
"
              >
                Symptoms
              </h3>

              <p
                className="
text-gray-500
mt-2
"
              >
                {item.medical?.symptoms || "No symptoms"}
              </p>

              <p
                className="
text-gray-500
mt-2
"
              >
                ⏳ {item.queue?.estimatedWaitingTime} mins
              </p>
            </div>

            {/* DATE */}

            <div>
              <h3
                className="
font-bold
"
              >
                Appointment
              </h3>

              <p
                className="
text-gray-500
mt-2
"
              >
                📆 {new Date(item.appointmentDate).toLocaleDateString()}
              </p>

              <p
                className="
text-gray-500
"
              >
                ⏰ {item.appointmentTime}
              </p>

              <p
                className="
text-gray-500
mt-1
"
              >
                🩺 {item.booking?.appointmentType}
              </p>

              <p
                className="
text-gray-500
mt-1
"
              >
                🌐 {item.booking?.bookingSource}
              </p>
            </div>

            {/* PAYMENT */}

            <div>
              <h3
                className="
font-bold
"
              >
                Payment
              </h3>

              <p
                className="
text-gray-500
mt-2
"
              >
                ₹ {item.payment?.amount}
              </p>

              <span
                className={`
inline-block
mt-2
px-4
py-2
rounded-full
font-semibold

${item.payment?.status === "paid"
                    ? "bg-green-100 text-green-600"
                    : item.payment?.status === "failed"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-600"
                  }
`}
              >
                {item.payment?.status}
              </span>
            </div>

            {/* STATUS */}

            <div>
              <h3
                className="
font-bold
mb-3
"
              >
                Appointment Status
              </h3>

              <select
                disabled={
                  item.status === "completed" ||
                  item.status === "cancelled"
                }
                value={item.status}
                onChange={(e) =>
                  handleStatus(
                    item._id,
                    e.target.value,
                  )
                }
                className="
bg-gray-100
p-3
rounded-xl
outline-none
w-full
disabled:bg-gray-200
disabled:cursor-not-allowed
"
              >
                <option value="pending">Pending</option>

                <option value="confirmed">Confirmed</option>

                <option value="checked_in">Checked In</option>

                <option value="in_consultation">In Consultation</option>

                <option value="completed">Completed</option>

                <option value="cancelled">Cancelled</option>

                <option value="rejected">Rejected</option>

                <option value="no_show">No Show</option>
              </select>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DoctorDashboard;
