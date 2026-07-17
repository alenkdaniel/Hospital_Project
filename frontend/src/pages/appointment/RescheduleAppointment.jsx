import { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import {
  getAppointmentById,
  rescheduleAppointment,
  resetAppointment,
} from "../../features/appointment/appointmentSlice";

import toast from "react-hot-toast";

import { motion } from "framer-motion";

const RescheduleAppointment = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const {
    appointment,

    isLoading,

    isError,

    isSuccess,

    message,
  } = useSelector((state) => state.appointment);

  const [form, setForm] = useState({
    appointmentDate: "",

    appointmentTime: "",

    reason: "",
  });

  useEffect(() => {
    dispatch(getAppointmentById(id));

    return () => {
      dispatch(resetAppointment());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (appointment) {
      setForm({
        appointmentDate: appointment.appointmentDate?.split("T")[0],

        appointmentTime: appointment.appointmentTime,

        reason: "",
      });
    }
  }, [appointment]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

 useEffect(() => {
  if (
    isSuccess &&
    appointment &&
    appointment.appointmentDate === form.appointmentDate &&
    appointment.appointmentTime === form.appointmentTime
  ) {
    toast.success("Appointment rescheduled successfully");

    navigate(`/appointments/${id}`);
  }
}, [isSuccess, appointment, form, navigate, id]);

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  // ======================================
  // SUBMIT
  // ======================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.appointmentDate) {
      toast.error("Select appointment date");

      return;
    }

    if (!form.appointmentTime) {
      toast.error("Select appointment time");

      return;
    }

    dispatch(
      rescheduleAppointment({
        id,

        data: {
          appointmentDate: form.appointmentDate,

          appointmentTime: form.appointmentTime,

          reason: form.reason,
        },
      }),
    );
  };

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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="
max-w-3xl
mx-auto
bg-white
rounded-3xl
shadow-xl
p-10
"
      >
        <h1 className="text-4xl font-bold mb-8">Reschedule Appointment</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* DATE */}

          <div>
            <label className="block mb-2 font-semibold">Appointment Date</label>

            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              name="appointmentDate"
              value={form.appointmentDate}
              onChange={handleChange}
              className="
w-full
border
rounded-xl
p-4
outline-none
focus:ring-2
focus:ring-blue-500
"
            />
          </div>

          {/* TIME */}

          <div>
            <label className="block mb-2 font-semibold">Appointment Time</label>

            <input
              type="time"
              name="appointmentTime"
              value={form.appointmentTime}
              onChange={handleChange}
              className="
w-full
border
rounded-xl
p-4
outline-none
focus:ring-2
focus:ring-blue-500
"
            />
          </div>

          {/* REASON */}

          <div>
            <label className="block mb-2 font-semibold">Reason</label>

            <textarea
              rows="4"
              name="reason"
              value={form.reason}
              onChange={handleChange}
              placeholder="Reason for rescheduling..."
              className="
w-full
border
rounded-xl
p-4
outline-none
focus:ring-2
focus:ring-blue-500
resize-none
"
            />
          </div>

          {/* BUTTONS */}

          <div
            className="
flex
justify-end
gap-4
pt-4
"
          >
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="
px-6
py-3
rounded-xl
bg-gray-300
hover:bg-gray-400
font-semibold
"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="
px-8
py-3
rounded-xl
bg-blue-600
hover:bg-blue-700
text-white
font-semibold
"
            >
              {isLoading ? "Updating..." : "Reschedule Appointment"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default RescheduleAppointment;
