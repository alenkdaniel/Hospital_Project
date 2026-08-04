import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { motion } from "framer-motion";

import { Star } from "lucide-react";

import { getAllReviews } from "../features/review/reviewSlice";

const StarRow = ({ rating }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }
      />
    ))}
  </div>
);

const Reviews = () => {
  const dispatch = useDispatch();

  const { allReviews, isLoading, page, totalPages } = useSelector(
    (state) => state.review,
  );

  useEffect(() => {
    dispatch(getAllReviews({ page: 1, limit: 12 }));
  }, [dispatch]);

  const handleLoadMore = () => {
    dispatch(getAllReviews({ page: page + 1, limit: 12 }));
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 pb-20 pt-28 md:px-24">
      <div className="rounded-[40px] bg-linear-to-r from-blue-600 to-cyan-500 p-12 text-white shadow-xl">
        <h1 className="text-5xl font-bold">🗣️ Patient Reviews</h1>

        <p className="mt-5 text-lg text-blue-100">
          Real experiences shared by patients about our doctors and hospitals
        </p>
      </div>

      {isLoading && allReviews.length === 0 && (
        <p className="mt-20 text-center text-xl">Loading reviews...</p>
      )}

      {!isLoading && allReviews.length === 0 && (
        <div className="mt-24 text-center text-xl text-gray-500">
          No reviews yet — be the first to share your experience!
        </div>
      )}

      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {allReviews.map((review, index) => (
          <motion.div
            key={review._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: (index % 6) * 0.1 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-white p-8 shadow-sm"
          >
            <p className="font-semibold text-slate-900">
              {review.patient?.name || "Verified Patient"}
            </p>

            {review.doctorComment && (
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-600">
                    👨‍⚕️ Dr. {review.doctor?.name}
                  </span>

                  <StarRow rating={review.doctorRating} />
                </div>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  "{review.doctorComment}"
                </p>
              </div>
            )}

            {review.hospitalComment && (
              <div className="mt-5 border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-cyan-600">
                    🏥 {review.hospital?.name}
                  </span>

                  <StarRow rating={review.hospitalRating} />
                </div>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  "{review.hospitalComment}"
                </p>
              </div>
            )}

            <p className="mt-5 text-xs text-gray-400">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </motion.div>
        ))}
      </div>

      {!isLoading && page < totalPages && (
        <div className="mt-12 text-center">
          <button
            onClick={handleLoadMore}
            className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default Reviews;