import { useEffect } from "react";

import { useParams, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import {
  getAppointmentById,
  cancelAppointment,
  resetAppointment,
} from "../../features/appointment/appointmentSlice";

import { motion } from "framer-motion";

import toast from "react-hot-toast";

const AppointmentDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const {
    appointment,

    isLoading,

    isError,

    message,
  } = useSelector((state) => state.appointment);

  useEffect(() => {
    dispatch(getAppointmentById(id));

    return () => {
      dispatch(resetAppointment());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  const handleCancel = () => {
    const reason = window.prompt(
      "Please enter cancellation reason:"
    );

    if (!reason) return;

    dispatch(
      cancelAppointment({
        id,
        reason,
      })
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading appointment...
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Appointment not found.
      </div>
    );
  }

  return (
    <div
      className="
min-h-screen
bg-gray-100
pt-28
pb-20
px-6
md:px-20
"
    >
      {/* HEADER */}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="
bg-gradient-to-r
from-blue-600
to-cyan-500
rounded-[35px]
p-10
text-white
shadow-xl
mb-10
"
      >
        <h1 className="text-4xl font-bold">
          Appointment Details
        </h1>

        <p className="mt-3 text-blue-100">
          Appointment No :
          {" "}
          {appointment.booking?.appointmentNumber}
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* Doctor Card */}


        <motion.div
          whileHover={{ scale: 1.02 }}
          className="
bg-white
rounded-3xl
shadow-xl
p-8
"
        >
          <h2 className="text-2xl font-bold mb-6">
            👨‍⚕️ Doctor Details
          </h2>

          <div className="space-y-3">

            <p>
              <strong>Name :</strong>{" "}
              Dr. {appointment.doctor?.name}
            </p>

            <p>
              <strong>Specialization :</strong>{" "}
              {appointment.doctor?.specialization}
            </p>

            <p>
              <strong>Consultation Fee :</strong>{" "}
              ₹{appointment.booking?.consultationFee}
            </p>

          </div>
        </motion.div>



        {/* Hospital Card */}

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="
bg-white
rounded-3xl
shadow-xl
p-8
"
        >
          <h2 className="text-2xl font-bold mb-6">
            🏥 Hospital Details
          </h2>

          <div className="space-y-3">

            <p>
              <strong>Name :</strong>{" "}
              {appointment.hospital?.name}
            </p>

            <p>
              <strong>Address :</strong>{" "}
              {appointment.hospital?.address?.street},{" "}
              {appointment.hospital?.address?.city},{" "}
              {appointment.hospital?.address?.state} -{" "}
              {appointment.hospital?.address?.pincode},{" "}
              {appointment.hospital?.address?.country}
            </p>

          </div>
        </motion.div>

        {/* Appointment Card */}

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="
bg-white
rounded-3xl
shadow-xl
p-8
"
        >
          <h2 className="text-2xl font-bold mb-6">
            📅 Appointment Information
          </h2>

          <div className="space-y-3">

            <p>
              <strong>Date :</strong>{" "}
              {new Date(
                appointment.appointmentDate
              ).toLocaleDateString()}
            </p>

            <p>
              <strong>Time :</strong>{" "}
              {appointment.appointmentTime}
            </p>

            <p>
              <strong>Type :</strong>{" "}
              {appointment.booking?.appointmentType}
            </p>

            <p>
              <strong>Booked Via :</strong>{" "}
              {appointment.booking?.bookingSource}
            </p>

            <p>
              <strong>Created At :</strong>{" "}
              {appointment.createdAt
                ? new Date(appointment.createdAt).toLocaleString()
                : "N/A"}
            </p>

          </div>
        </motion.div>

        {/* Queue Card */}


        <motion.div
          whileHover={{ scale: 1.02 }}
          className="
bg-white
rounded-3xl
shadow-xl
p-8
"
        >
          <h2 className="text-2xl font-bold mb-6">
            🎫 Queue Information
          </h2>

          <div className="space-y-3">

            <p>
              <strong>Token Number :</strong>{" "}
              {appointment.queue?.tokenNumber}
            </p>

            <p>
              <strong>Estimated Waiting :</strong>{" "}
              {appointment.queue?.estimatedWaitingTime}
              {" "}minutes
            </p>

            <p>
              <strong>Consultation Duration :</strong>{" "}
              {appointment.queue?.consultationDuration}
              {" "}minutes
            </p>

            <p>
              <strong>Current Position :</strong>{" "}
              {appointment.queue?.currentPosition}
            </p>

            <p>
              <strong>Queue Status :</strong>{" "}
              {appointment.queue?.queueStatus}
            </p>

          </div>
        </motion.div>

        {/* Medical Card */}

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="
bg-white
rounded-3xl
shadow-xl
p-8
"
        >
          <h2 className="text-2xl font-bold mb-6">
            🩺 Medical Details
          </h2>

          <div className="space-y-3">

            <p>
              <strong>Symptoms :</strong>
            </p>

            <p className="text-gray-600">
              {appointment.medical?.symptoms || "N/A"}
            </p>

            <p>
              <strong>Prescription :</strong>
            </p>

            <p className="text-gray-600">
              {appointment.medical?.prescription || "Not Available"}
            </p>

            <p>
              <strong>Doctor Notes :</strong>
            </p>

            <p className="text-gray-600">
              {appointment.medical?.doctorNotes || "No Notes"}
            </p>

          </div>
        </motion.div>

        {/* Consultation Report */}

        {appointment.consultation?.status === "completed" && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="
bg-white
rounded-3xl
shadow-xl
p-8
md:col-span-2
"
          >
            <h2 className="text-2xl font-bold mb-6">
              📋 Consultation Report
            </h2>

            <div className="space-y-5">
              <div>
                <p className="font-semibold">Diagnosis :</p>

                <p className="text-gray-600 mt-1">
                  {appointment.consultation?.diagnosis || "N/A"}
                </p>
              </div>

              <div>
                <p className="font-semibold mb-2">Medicines :</p>

                {appointment.consultation?.medicines?.length > 0 ? (
                  <div className="space-y-2">
                    {appointment.consultation.medicines.map((item, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600"
                      >
                        <p className="font-semibold text-gray-800">
                          💊 {item.medicine?.name || "Medicine"}
                        </p>

                        <p>
                          {item.dosage && `Dosage: ${item.dosage} `}
                          {item.frequency && `· Frequency: ${item.frequency} `}
                          {item.duration && `· Duration: ${item.duration}`}
                        </p>

                        {item.instructions && (
                          <p className="mt-1">Instructions: {item.instructions}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No medicines prescribed</p>
                )}
              </div>

              <div>
                <p className="font-semibold mb-2">Recommended Tests :</p>

                {appointment.consultation?.tests?.length > 0 ? (
                  <div className="space-y-2">
                    {appointment.consultation.tests.map((item, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600"
                      >
                        <p className="font-semibold text-gray-800">
                          🧪 {item.test?.name || "Test"}
                        </p>

                        {item.notes && <p className="mt-1">Notes: {item.notes}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No tests recommended</p>
                )}
              </div>

              <div>
                <p className="font-semibold">Doctor's Remarks :</p>

                <p className="text-gray-600 mt-1">
                  {appointment.consultation?.remarks || "N/A"}
                </p>
              </div>

              <div>
                <p className="font-semibold">Follow-up Date :</p>

                <p className="text-gray-600 mt-1">
                  {appointment.consultation?.followUpDate
                    ? new Date(
                        appointment.consultation.followUpDate
                      ).toLocaleDateString()
                    : "Not Required"}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Payment Card */}

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="
bg-white
rounded-3xl
shadow-xl
p-8
"
        >
          <h2 className="text-2xl font-bold mb-6">
            💳 Payment Details
          </h2>

          <div className="space-y-3">

            <p>
              <strong>Amount :</strong>{" "}
              ₹{appointment.payment?.amount}
            </p>

            <p>
              <strong>Status :</strong>{" "}
              <span
                className={`font-semibold ${appointment.payment?.status === "paid"
                  ? "text-green-600"
                  : appointment.payment?.status === "failed"
                    ? "text-red-600"
                    : "text-yellow-600"
                  }`}
              >
                {appointment.payment?.status}
              </span>
            </p>

            <p>
              <strong>Paid At :</strong>{" "}
              {appointment.payment?.paidAt
                ? new Date(
                  appointment.payment.paidAt
                ).toLocaleString()
                : "Not Paid"}
            </p>

          </div>
        </motion.div>
      </div>

      {/* STATUS  */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="
bg-white
rounded-3xl
shadow-xl
p-8
mt-10
"
      >
        <h2 className="text-2xl font-bold mb-6">
          📌 Appointment Status
        </h2>

        <span
          className={`
inline-block
px-6
py-3
rounded-full
font-bold
capitalize

${appointment.status === "confirmed"
              ? "bg-green-100 text-green-700"
              : appointment.status === "completed"
                ? "bg-blue-100 text-blue-700"
                : appointment.status === "cancelled"
                  ? "bg-red-100 text-red-700"
                  : appointment.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
            }
`}
        >
          {appointment.status}
        </span>
      </motion.div>

      <div
        className="
flex
flex-wrap
gap-5
justify-end
mt-10
"
      >

        {appointment.status !== "cancelled" &&
          appointment.status !== "completed" && (
            <button
              onClick={handleCancel}
              className="
bg-red-600
hover:bg-red-700
text-white
px-8
py-3
rounded-xl
font-semibold
transition
"
            >
              Cancel Appointment
            </button>
          )}

        {appointment.status !== "cancelled" &&
          appointment.status !== "completed" && (
            <button
              onClick={() =>
                navigate(
                  `/appointments/${appointment._id}/reschedule`
                )
              }
              className="
bg-blue-600
hover:bg-blue-700
text-white
px-8
py-3
rounded-xl
font-semibold
transition
"
            >
              Reschedule Appointment
            </button>
          )}

      </div>

    </div>
  );

};

export default AppointmentDetails;