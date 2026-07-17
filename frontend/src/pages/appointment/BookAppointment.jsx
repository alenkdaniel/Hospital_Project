// import { useEffect, useState } from "react";

// import { useParams, useNavigate } from "react-router-dom";

// import { useDispatch, useSelector } from "react-redux";

// import { getDoctorById } from "../../features/doctor/doctorSlice";

// import {
//   createAppointment,
//   resetAppointment,
// } from "../../features/appointment/appointmentSlice";

// import {
//   createPaymentOrder,
//   verifyPayment,
// } from "../../features/payment/paymentSlice";

// import paymentService from "../../features/payment/paymentService";

// import toast from "react-hot-toast";

// const BookAppointment = () => {
//   const { doctorId } = useParams();

//   const navigate = useNavigate();

//   const dispatch = useDispatch();

//   const { user } = useSelector((state) => state.auth);

//   const { doctor } = useSelector((state) => state.doctor);

//   const {
//     appointment,

//     isLoading,

//     isSuccess,

//     isError,

//     message,
//   } = useSelector((state) => state.appointment);

//   const [form, setForm] = useState({
//   reason: "",

//   date: "",

//   time: "",
// });

//   // =======================
//   // LOAD DOCTOR
//   // =======================

//   useEffect(() => {
//     dispatch(getDoctorById(doctorId));
//   }, [doctorId, dispatch]);

//   // =======================
//   // CHANGE
//   // =======================

//   const handleChange = (e) => {
//     setForm({
//       ...form,

//       [e.target.name]: e.target.value,
//     });
//   };

//   // =======================
//   // BOOK APPOINTMENT
//   // =======================

//   const submitHandler = (e) => {
//     e.preventDefault();

//     if (!form.date) {
//   toast.error("Select appointment date");
//   return;
// }

//     if (!form.time) {
//       toast.error("Select appointment time");

//       return;
//     }

//     if (!doctor?.hospital) {
//       toast.error("Hospital not found");

//       return;
//     }

//   const data = {
//   hospital: doctor.hospital._id || doctor.hospital,

//   doctor: doctor._id,

//   appointmentDate: form.date,

//   appointmentTime: form.time,

//   symptoms: form.reason,
// };

//     console.log("BOOKING DATA:", data);

//     dispatch(createAppointment(data));
//   };

//   // =======================
//   // PAYMENT
//   // =======================

//   useEffect(() => {
//     const startPayment = async () => {
//       if (isSuccess && appointment) {
//         try {
//           const orderResult = await dispatch(
//             createPaymentOrder(appointment._id),
//           ).unwrap();

//           await paymentService.openRazorpayCheckout({
//             order: orderResult,

//             user,

//             onSuccess: async (response) => {
//               await dispatch(
//                 verifyPayment({
//                   appointmentId: appointment._id,

//                   ...response,
//                 }),
//               );

//               toast.success("Appointment booked successfully");

//               navigate("/my");
//             },
//           });
//         } catch (error) {
//           toast.error("Payment failed");
//         }
//       }
//     };

//     startPayment();

//     if (isError) {
//       toast.error(message);
//     }

//     return () => {
//       dispatch(resetAppointment());
//     };
//   }, [isSuccess, isError, message, appointment, dispatch, navigate, user]);

//   return (
//     <div
//       className="
// min-h-screen
// bg-gray-50
// pt-28
// px-6
// flex
// justify-center
// "
//     >
//       <div
//         className="
// bg-white
// shadow-2xl
// rounded-[35px]
// p-10
// w-full
// max-w-5xl
// "
//       >
//         <h1 className="text-4xl font-bold mb-8">📅 Book Appointment</h1>

//         {/* DOCTOR DETAILS */}

//         {doctor && (
//           <div
//             className="
// bg-blue-50
// p-6
// rounded-3xl
// mb-8
// "
//           >
//             <h2 className="text-2xl font-bold">Dr. {doctor.name}</h2>

//             <p>🩺 {doctor.specialization}</p>

//             <p>₹ {doctor.consultationFee}</p>

//             {/* AVAILABLE DAYS */}

//             <div
//               className="
// mt-5
// bg-green-100
// p-4
// rounded-xl
// "
//             >
//               <p>Available Days: {doctor.availability?.days?.join(", ")}</p>

//               <p className="mt-3 font-bold">Available Slots:</p>

//               <div className="flex flex-wrap gap-2 mt-2">
//                 {doctor.availability?.slots

//                   ?.filter((slot) => !slot.isBooked)

//                   .map((slot, index) => (
//                     <span
//                       key={index}
//                       className="
// bg-white
// px-4
// py-2
// rounded-xl
// "
//                     >
//                       {slot.start}-{slot.end}
//                     </span>
//                   ))}
//               </div>
//             </div>
//           </div>
//         )}

//         <form onSubmit={submitHandler} className="space-y-5">

//           <input
//             name="reason"
//             value={form.reason}
//             onChange={handleChange}
//             placeholder="Problem"
//             className="input"
//           />

//           <input
//             type="date"
//             name="date"
//             value={form.date}
//             onChange={handleChange}
//             className="input"
//           />

//           {/* SLOT SELECT */}

//           <select
//             name="time"
//             value={form.time}
//             onChange={handleChange}
//             className="input"
//           >
//             <option value="">Select Appointment Time</option>

//             {doctor?.availability?.slots

//               ?.filter((slot) => !slot.isBooked)

//               .map((slot, index) => (
//                 <option key={index} value={slot.start}>
//                   {slot.start}-{slot.end}
//                 </option>
//               ))}
//           </select>

//           <button
//             disabled={isLoading}
//             className="
// w-full
// bg-blue-600
// text-white
// py-4
// rounded-xl
// font-bold
// "
//           >
//             {isLoading ? "Booking..." : "Confirm & Pay"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default BookAppointment;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, Clock, MapPin, CreditCard, Stethoscope } from "lucide-react";
import toast from "react-hot-toast";

import { getDoctorById } from "../../features/doctor/doctorSlice";

import {
  createAppointment,
  resetAppointment,
  getAvailableSlots
} from "../../features/appointment/appointmentSlice";

import {
  createPaymentOrder,
  verifyPayment,
} from "../../features/payment/paymentSlice";

import paymentService from "../../features/payment/paymentService";

const BookAppointment = () => {
  const { doctorId } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const { doctor, isLoading: doctorLoading } = useSelector(
    (state) => state.doctor
  );

  const {
    appointment,
    availableSlots,
    isLoading,
    isSuccess,
    isError,
    message,
  } = useSelector((state) => state.appointment);

  const [form, setForm] = useState({
    appointmentDate: "",
    slot: "",
    symptoms: "",
  });

  useEffect(() => {
    dispatch(getDoctorById(doctorId));
  }, [dispatch, doctorId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "appointmentDate" && { slot: "" }),
    }));
  };

  useEffect(() => {

    if (!form.appointmentDate) return;

    dispatch(
      getAvailableSlots({
        doctorId,
        date: form.appointmentDate
      })
    );

  }, [
    dispatch,
    doctorId,
    form.appointmentDate
  ]);

  const submitHandler = (e) => {
    e?.preventDefault();

    if (!doctor) {
      toast.error("Doctor not found");
      return;
    }

    if (!form.appointmentDate) {
      toast.error("Please select appointment date");
      return;
    }

    if (!form.slot) {
      toast.error("Please select appointment slot");
      return;
    }

    if (!availableSlots?.length) {
      toast.error("No slots available");
      return;
    }

    const selectedSlot = availableSlots?.find(
      (item) => item.start === form.slot
    );

    if (!selectedSlot) {
      toast.error("Invalid slot");
      return;
    }


    dispatch(
      createAppointment({
        hospital: doctor.hospital?._id || doctor.hospital,
        doctor: doctor._id,
        appointmentDate: form.appointmentDate,
        slot: {
          start: selectedSlot.start,
          end: selectedSlot.end,
        },
        symptoms: form.symptoms,
      })
    );
  };

  useEffect(() => {
    const payment = async () => {
      if (!isSuccess || !appointment) return;

      try {
        const order = await dispatch(
          createPaymentOrder({
            appointmentId: appointment._id,
          })
        ).unwrap();

        await paymentService.openRazorpayCheckout({
          order,
          user,
          onSuccess: async (response) => {
            await dispatch(
              verifyPayment({
                appointmentId: appointment._id,
                ...response,
              })
            ).unwrap();

            dispatch(resetAppointment());

            toast.success("Appointment booked successfully");

            navigate("/my");
          },
        });
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
          error?.message ||
          "Payment failed"
        );
      }
    };

    payment();

    if (isError) toast.error(message);

    return () => dispatch(resetAppointment());
  }, [
    isSuccess,
    appointment,
    dispatch,
    navigate,
    user,
    isError,
    message,
  ]);

  return (
    <div className="min-h-screen bg-slate-100 pt-28 pb-16">

      <div className="max-w-7xl mx-auto px-6">

        <h1 className="text-4xl font-bold text-slate-900 mb-10">
          Book Appointment
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT */}

          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8">

            {doctorLoading ? (
              <p>Loading...</p>
            ) : doctor && (
              <>
                {/* ================= DOCTOR CARD ================= */}

                <div className="flex items-start gap-6 border border-slate-200 rounded-3xl p-6">

                  <img
                    src={
                      doctor.image ||
                      "https://ui-avatars.com/api/?name=Doctor&background=2563eb&color=fff"
                    }
                    alt={doctor.name}
                    className="w-32 h-32 rounded-2xl object-cover"
                  />

                  <div className="flex-1">

                    <div className="flex items-center justify-between">

                      <div>

                        <h2 className="text-3xl font-bold text-slate-900">
                          Dr. {doctor.name}
                        </h2>

                        <p className="text-slate-500 mt-1">
                          {doctor.specialization}
                        </p>

                      </div>

                      <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                        Available
                      </span>

                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mt-6">

                      <div className="bg-slate-50 rounded-xl p-4">

                        <p className="text-sm text-slate-500">
                          Consultation Fee
                        </p>

                        <h3 className="text-xl font-bold mt-1">
                          ₹{doctor.consultationFee}
                        </h3>

                      </div>

                      <div className="bg-slate-50 rounded-xl p-4">

                        <p className="text-sm text-slate-500">
                          Experience
                        </p>

                        <h3 className="text-xl font-bold mt-1">
                          {doctor.experience} Years
                        </h3>

                      </div>

                      <div className="bg-slate-50 rounded-xl p-4">

                        <p className="text-sm text-slate-500">
                          Hospital
                        </p>

                        <h3 className="text-lg font-semibold mt-1">
                          {doctor.hospital?.name}
                        </h3>

                      </div>

                    </div>

                  </div>

                </div>

                {/* ================= BOOKING FORM ================= */}

                <form
                  onSubmit={submitHandler}
                  className="mt-10 space-y-8"
                >

                  {/* DATE */}

                  <div>

                    <label className="block text-lg font-semibold mb-3">

                      <Calendar className="inline mr-2 w-5 h-5" />

                      Appointment Date

                    </label>

                    <input
                      type="date"
                      name="appointmentDate"
                      value={form.appointmentDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="
      w-full
      border
      rounded-xl
      px-5
      py-4
      text-lg
      focus:ring-2
      focus:ring-blue-500
      outline-none
      "
                    />

                  </div>

                  {/* SLOT */}

                  <div>

                    <label className="block text-lg font-semibold mb-4">

                      <Clock className="inline mr-2 w-5 h-5" />

                      Available Slots

                    </label>

                    {!availableSlots || availableSlots.length === 0 ? (

                      <div className="bg-red-50 rounded-xl p-5 text-red-600">

                        No slots available for selected date.

                      </div>

                    ) : (

                      <div className="grid md:grid-cols-3 gap-4">

                        {availableSlots.map((slot) => (

                          <button
                            type="button"
                            key={slot.start}
                            onClick={() =>
                              setForm({
                                ...form,
                                slot: slot.start,
                              })
                            }
                            className={`
            border
            rounded-xl
            p-4
            transition
            ${form.slot === slot.start
                                ? "bg-blue-600 text-white border-blue-600"
                                : "hover:border-blue-500"
                              }
            `}
                          >

                            <p className="font-semibold">

                              {slot.start}

                            </p>

                            <p className="text-sm mt-1">

                              {slot.end}

                            </p>

                          </button>

                        ))}

                      </div>

                    )}

                  </div>

                  {/* SYMPTOMS */}

                  <div>

                    <label className="block text-lg font-semibold mb-3">

                      <Stethoscope className="inline mr-2 w-5 h-5" />

                      Symptoms

                    </label>

                    <textarea
                      rows={5}
                      name="symptoms"
                      value={form.symptoms}
                      onChange={handleChange}
                      placeholder="Describe your symptoms..."
                      className="
      w-full
      border
      rounded-xl
      p-5
      resize-none
      focus:ring-2
      focus:ring-blue-500
      outline-none
      "
                    />

                  </div>
                </form>
              </>
            )}

          </div>

          {/* ================= RIGHT SIDE ================= */}

          <div className="space-y-6">

            {/* BOOKING SUMMARY */}

            <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-28">

              <h2 className="text-2xl font-bold mb-8">
                Booking Summary
              </h2>

              {doctor && (

                <div className="space-y-6">

                  <div className="flex items-center gap-4">

                    <img
                      src={
                        doctor.image ||
                        "https://ui-avatars.com/api/?name=Doctor&background=2563eb&color=fff"
                      }
                      alt={doctor.name}
                      className="w-20 h-20 rounded-2xl object-cover"
                    />

                    <div>

                      <h3 className="font-bold text-xl">
                        Dr. {doctor.name}
                      </h3>

                      <p className="text-slate-500">
                        {doctor.specialization}
                      </p>

                    </div>

                  </div>

                  <hr />

                  <div className="space-y-5">

                    <div className="flex justify-between">

                      <span className="text-slate-500">
                        Hospital
                      </span>

                      <span className="font-semibold text-right">
                        {doctor.hospital?.name}
                      </span>

                    </div>

                    <div className="flex justify-between">

                      <span className="text-slate-500">
                        Date
                      </span>

                      <span className="font-semibold">
                        {form.appointmentDate || "--"}
                      </span>

                    </div>

                    <div className="flex justify-between">

                      <span className="text-slate-500">
                        Time
                      </span>

                      <span className="font-semibold">
                        {form.slot || "--"}
                      </span>

                    </div>

                    <div className="flex justify-between">

                      <span className="text-slate-500">
                        Consultation Fee
                      </span>

                      <span className="font-bold text-blue-600 text-lg">
                        ₹{doctor.consultationFee}
                      </span>

                    </div>

                  </div>

                  <hr />

                  <div>

                    <h4 className="font-semibold mb-2">
                      Symptoms
                    </h4>

                    <div className="bg-slate-50 rounded-xl p-4 min-h-20 text-slate-600">

                      {form.symptoms || "No symptoms entered."}

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={submitHandler}
                    disabled={
                      isLoading ||
                      !form.appointmentDate ||
                      !form.slot
                    }
                    className="
              w-full
              py-4
              rounded-2xl
              bg-blue-600
              hover:bg-blue-700
              transition
              text-white
              text-lg
              font-bold
              disabled:bg-gray-400
              disabled:cursor-not-allowed
              "
                  >
                    {isLoading ? (
                      "Processing..."
                    ) : (
                      <>
                        <CreditCard className="inline mr-2 h-5 w-5" />
                        Confirm & Pay
                      </>
                    )}
                  </button>

                </div>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default BookAppointment;
