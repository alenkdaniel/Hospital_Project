import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sophia Williams",
    location: "New York",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80",
    review:
      "Booking my appointment was incredibly simple. The hospital staff and doctors were professional, and I received excellent care.",
  },

  {
    id: 2,
    name: "Michael Johnson",
    location: "Chicago",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80",
    review:
      "I found a specialist within minutes. The entire booking process was smooth and saved me a lot of time.",
  },

  {
    id: 3,
    name: "Emily Davis",
    location: "Los Angeles",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80",
    review:
      "The emergency hospital locator helped my family during an urgent situation. Highly recommended healthcare platform.",
  },
];

const Testimonials = () => {
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
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.2,
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
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="mt-6 leading-8 text-gray-600">
                "{item.review}"
              </p>

              <div className="mt-8 flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-14 w-14 rounded-full object-cover"
                />

                <div>
                  <h3 className="font-semibold text-slate-900">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {item.location}
                  </p>
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