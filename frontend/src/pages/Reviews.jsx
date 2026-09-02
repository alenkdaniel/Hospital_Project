import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Star, ThumbsUp, Flag, ArrowLeft, ArrowRight } from "lucide-react";
import { getAllReviews, toggleHelpful } from "../features/review/reviewSlice";

const StarRow = ({ rating }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={
          i < Math.round(rating)
            ? "fill-amber-400 text-amber-400"
            : "text-ink-200"
        }
      />
    ))}
  </div>
);

const LIMIT = 5;

const Reviews = () => {
  const dispatch = useDispatch();

  const { allReviews, isLoading, totalPages } = useSelector(
    (state) => state.review,
  );

  const { user } = useSelector((state) => state.auth);

  const [currentPage, setCurrentPage] = useState(1);
  const [reportedIds, setReportedIds] = useState([]);

  useEffect(() => {
    dispatch(getAllReviews({ page: currentPage, limit: LIMIT }));
  }, [dispatch, currentPage]);

  const goToPage = (nextPage) => {
    setCurrentPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleHelpful = (reviewId) => {
    if (!user) {
      toast.error("Please log in to mark a review as helpful.");
      return;
    }
    dispatch(toggleHelpful(reviewId));
  };

  const handleReport = (reviewId) => {
    if (reportedIds.includes(reviewId)) return;
    setReportedIds((ids) => [...ids, reviewId]);
    toast.success("Thanks — we'll take a look at this review.");
  };

  // Meta line under each review card — describes whichever side
  // (doctor visit or hospital stay) this particular card is about.
  const getMeta = (review) => {
    if (review.doctorComment) {
      return {
        text: `Dr. ${review.doctor?.name || "Unknown"} • ${review.hospital?.name || ""}`,
        comment: review.doctorComment,
        rating: review.doctorRating,
      };
    }
    return {
      text: `${review.doctor?.department || review.doctor?.specialization || "General"} Dept • ${review.hospital?.name || ""}`,
      comment: review.hospitalComment,
      rating: review.hospitalRating,
    };
  };

  return (
    <div className="min-h-screen bg-ink-50 px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {isLoading && allReviews.length === 0 && (
          <p className="py-16 text-center text-lg text-ink-500">
            Loading reviews...
          </p>
        )}

        {!isLoading && allReviews.length === 0 && (
          <div className="rounded-3xl border border-dashed border-ink-200 bg-white py-20 text-center">
            <p className="text-xl font-bold text-ink-900">No reviews yet</p>
            <p className="mt-2 text-ink-500">
              Be the first to share your experience.
            </p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allReviews.map((review, index) => {
            const meta = getMeta(review);
            const name = review.patient?.name || "Verified Patient";
            const initial = name.charAt(0).toUpperCase();
            const reported = reportedIds.includes(review._id);

            return (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: (index % 6) * 0.06 }}
                viewport={{ once: true }}
                className="flex flex-col rounded-[22px] border border-ink-100 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-800">
                    {initial}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate font-bold text-ink-900">
                        {name}
                      </p>
                      <span className="shrink-0 text-xs text-ink-400">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-brand-700">
                      Verified Patient
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <StarRow rating={meta.rating} />
                </div>

                <span className="mt-3 inline-block w-fit rounded-lg bg-ink-100 px-3 py-1 text-xs font-medium text-ink-600">
                  {meta.text}
                </span>

                <p className="mt-4 flex-1 text-sm leading-6 text-ink-600">
                  "{meta.comment}"
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-ink-100 pt-4 text-sm">
                  <button
                    onClick={() => handleHelpful(review._id)}
                    className="flex items-center gap-1.5 font-medium text-ink-500 transition hover:text-brand-700"
                  >
                    <ThumbsUp size={15} />
                    Helpful ({review.helpfulCount || 0})
                  </button>

                  <button
                    onClick={() => handleReport(review._id)}
                    disabled={reported}
                    className="text-ink-400 transition hover:text-rose-500 disabled:text-rose-400"
                    title={reported ? "Reported" : "Report this review"}
                  >
                    <Flag
                      size={15}
                      className={reported ? "fill-rose-100" : ""}
                    />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {!isLoading && totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-3">
              <button
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-200 bg-white text-lg text-ink-600 transition hover:bg-ink-100 disabled:opacity-40"
              >
                <ArrowLeft size={16} />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNumber = idx + 1;

                return (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`flex h-11 w-11 items-center justify-center rounded-full border font-semibold transition ${
                      currentPage === pageNumber
                        ? "border-brand-800 bg-brand-800 text-white"
                        : "border-ink-200 bg-white text-ink-700 hover:bg-ink-100"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => goToPage(currentPage + 1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-200 bg-white text-lg text-ink-600 transition hover:bg-ink-100 disabled:opacity-40"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;