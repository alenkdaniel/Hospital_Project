import { useState } from "react";

import { useDispatch } from "react-redux";

import { Star, X } from "lucide-react";

import toast from "react-hot-toast";

import { submitReview } from "../features/review/reviewSlice";

import { markAsReviewed } from "../features/appointment/appointmentSlice";

// =====================================
// STAR PICKER
// =====================================

const StarPicker = ({ value, onChange }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} star`}
        >
          <Star
            size={28}
            className={
              n <= value
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        </button>
      ))}
    </div>
  );
};

// =====================================
// REVIEW MODAL
// =====================================

const ReviewModal = ({ appointment, onClose }) => {
  const dispatch = useDispatch();

  const [doctorRating, setDoctorRating] = useState(0);
  const [doctorComment, setDoctorComment] = useState("");
  const [hospitalRating, setHospitalRating] = useState(0);
  const [hospitalComment, setHospitalComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!doctorRating || !hospitalRating) {
      toast.error("Please rate both the doctor and the hospital");
      return;
    }

    setSubmitting(true);

    try {
      await dispatch(
        submitReview({
          appointmentId: appointment._id,
          reviewData: {
            doctorRating,
            doctorComment,
            hospitalRating,
            hospitalComment,
          },
        }),
      ).unwrap();

      dispatch(markAsReviewed(appointment._id));

      toast.success("Thanks for sharing your experience!");

      onClose();
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Share Your Experience
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Appointment {appointment.booking?.appointmentNumber}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* DOCTOR */}

          <div className="rounded-2xl border border-gray-100 p-4">
            <p className="font-semibold text-gray-800">
              👨‍⚕️ Dr. {appointment.doctor?.name}
            </p>

            <div className="mt-3">
              <StarPicker value={doctorRating} onChange={setDoctorRating} />
            </div>

            <textarea
              value={doctorComment}
              onChange={(e) => setDoctorComment(e.target.value)}
              placeholder="How was your experience with the doctor?"
              maxLength={500}
              rows={3}
              className="mt-3 w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* HOSPITAL */}

          <div className="rounded-2xl border border-gray-100 p-4">
            <p className="font-semibold text-gray-800">
              🏥 {appointment.hospital?.name}
            </p>

            <div className="mt-3">
              <StarPicker
                value={hospitalRating}
                onChange={setHospitalRating}
              />
            </div>

            <textarea
              value={hospitalComment}
              onChange={(e) => setHospitalComment(e.target.value)}
              placeholder="How was your experience with the hospital?"
              maxLength={500}
              rows={3}
              className="mt-3 w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;