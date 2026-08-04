import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { motion } from "framer-motion";

import { Link } from "react-router-dom";

import { Star, Quote } from "lucide-react";

import { getFeaturedReviews } from "../../../features/review/reviewSlice";

// =====================================
// FALLBACK CONTENT
// Shown only until the platform has
// real patient reviews to display.
// =====================================

const fallbackTestimonials = [
  {
    id: "fallback-1",
    name: "Sophia Williams",
    review:
      "Booking my appointment was incredibly simple. The hospital staff and doctors were professional, and I received excellent care.",
  },

  {
    id: "fallback-2",
    name: "Michael Johnson",
    review:
      "I found a specialist within minutes. The entire booking process was smooth and saved me a lot of time.",
  },

  {
    id: "fallback-3",
    name: "Emily Davis",
    review:
      "The emergency hospital locator helped my family during an urgent situation. Highly recommended healthcare platform.",
  },
];

// =====================================
// BUILD A DISPLAY CARD FROM A REAL
// REVIEW DOCUMENT
//
// Each review has both a doctor side
// and a hospital side — prefer whichever
// one actually has a comment written.
// =====================================

const toCard = (review) => {
  const useDoctor = Boolean(review.doctorComment);

  return {
    id: review._id,
    name: review.patient?.name || "Verified Patient",
    review: useDoctor ? review.doctorComment : review.hospitalComment,
    rating: useDoctor ? review.doctorRating : review.hospitalRating,
    context: useDoctor
      ? `Dr. ${review.doctor?.name || ""}`
      : review.hospital?.name || "",
  };
};

const Testimonials = () => {
  const dispatch = useDispatch();

  const { featuredReviews } = useSelector((state) => state.review);

  useEffect(() => {
    dispatch(getFeaturedReviews(6));
  }, [dispatch]);

  const cards =
    featuredReviews.length > 0
      ? featuredReviews.map(toCard)
      : fallbackTestimonials;

  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-600">
            Testimonials
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            What Our Patients Say
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-500">
            Thousands of patients trust our platform to connect with the best
            hospitals and experienced doctors.
          </p>
        </motion.div>

        {/* Cards */}

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {cards.slice(0, 6).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: (index % 3) * 0.2,
              }}
              viewport={{ once: true }}
              className="group rounded-3xl bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <Quote className="text-blue-500" size={38} />

              <div className="mt-6 flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < (item.rating || 5)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>

              <p className="mt-6 leading-8 text-gray-600">
                "{item.review}"
              </p>

              <div className="mt-8 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                  {item.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    {item.name}
                  </h3>

                  {item.context && (
                    <p className="text-sm text-gray-500">{item.context}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Button */}

        <div className="mt-16 text-center">
          <Link
            to="/reviews"
            className="inline-flex items-center rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
          >
            View All Reviews
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;