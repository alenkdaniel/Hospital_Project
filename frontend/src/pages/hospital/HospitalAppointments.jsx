import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  getHospitalAppointments,
  updateAppointmentStatus,
  resetAppointment,
} from "../../features/appointment/appointmentSlice";

import { motion } from "framer-motion";

import toast from "react-hot-toast";

const HospitalAppointments = () => {
  const dispatch = useDispatch();

  const {
    hospitalAppointments,

    isLoading,

    isError,

    message,
  } = useSelector((state) => state.appointment);

  // =====================================
  // LOAD HOSPITAL APPOINTMENTS
  // =====================================

  useEffect(() => {
    dispatch(getHospitalAppointments());

    return () => {
      dispatch(resetAppointment());
    };
  }, [dispatch]);

  // =====================================
  // ERROR
  // =====================================

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  // =====================================
  // CHANGE STATUS
  // =====================================

  const changeStatus = async (id, status) => {
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
pt-28
px-10
bg-gray-50
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
          📅 Hospital Appointments
        </h1>

        <p
          className="
mt-3
text-blue-100
"
        >
          Manage patient bookings and doctor schedules
        </p>
      </div>

      {/* LOADING */}

      {isLoading && (
        <h2
          className="
text-center
mt-20
text-2xl
font-bold
"
        >
          Loading appointments...
        </h2>
      )}

      {/* EMPTY */}

      {!isLoading && hospitalAppointments?.length === 0 && (
        <div
          className="
text-center
mt-20
text-gray-500
text-xl
"
        >
          No appointments found
        </div>
      )}

      {/* APPOINTMENT LIST */}

      <div
        className="
mt-12
space-y-8
pb-20
"
      >
        {hospitalAppointments?.map((item) => (
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

              {/* <p
                className="
text-gray-500
mt-1
"
              >
                🎫 Token #{item.queue?.tokenNumber}
              </p> */}

              <p
                className="
text-gray-500
mt-1
"
              >
                ⏳ {item.queue?.estimatedWaitingTime} mins
              </p>
            </div>

            {/* DOCTOR */}

            <div>
              <h3
                className="
font-bold
"
              >
                👨‍⚕️ Doctor
              </h3>

              <p
                className="
text-gray-500
mt-2
"
              >
                Dr. {item.doctor?.name}
              </p>

              <p
                className="
text-gray-500
mt-1
text-sm
"
              >
                {item.doctor?.specialization}
              </p>
            </div>

            {/* APPOINTMENT */}

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
                ⏰ {item.slot?.start} - {item.slot?.end}
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

              <p className="text-gray-500 mt-2">
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

            {/* STATUS ACTION */}

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
                  changeStatus(
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

export default HospitalAppointments;
