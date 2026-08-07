import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Star, Quote } from "lucide-react";

import { getFeaturedReviews } from "../../../features/review/reviewSlice";
import ScrollReveal from "../../../components/ScrollReveal";

// Build a display card from a real review document — each review
// has a doctor side and a hospital side, use whichever was written.
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

  // Only render real, submitted reviews — no placeholder quotes.
  if (!featuredReviews.length) return null;

  const cards = featuredReviews.map(toCard);

  return (
    <section className="bg-ink-50 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal className="text-center">
          <span className="rounded-full bg-brand-100 px-4 py-2 text-sm font-semibold text-brand-700">
            Testimonials
          </span>
          <h2 className="mt-6 text-4xl font-bold text-ink-900">
            What Our Patients Say
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-500">
            Real feedback from patients who booked care through the
            platform.
          </p>
        </ScrollReveal>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {cards.slice(0, 6).map((item, index) => (
            <ScrollReveal key={item.id} delay={(index % 3) * 0.15}>
              <div className="group h-full rounded-3xl bg-white p-8 shadow-sm ring-1 ring-ink-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <Quote className="text-brand-500" size={36} />

                <div className="mt-6 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < (item.rating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-ink-200"
                      }
                    />
                  ))}
                </div>

                <p className="mt-6 leading-8 text-ink-600">"{item.review}"</p>

                <div className="mt-8 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700">
                    {item.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink-900">{item.name}</h3>
                    {item.context && (
                      <p className="text-sm text-ink-500">{item.context}</p>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-16 text-center" delay={0.2}>
          <Link
            to="/reviews"
            className="inline-flex items-center rounded-xl bg-brand-800 px-8 py-4 font-semibold text-white transition hover:bg-brand-900"
          >
            View All Reviews
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Testimonials;