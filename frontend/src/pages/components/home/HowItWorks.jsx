import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Stethoscope,
  CalendarCheck2,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Search Hospitals",
    description:
      "Browse verified hospitals by location, specialty, facilities, or emergency services.",
    icon: Search,
    link: "/hospitals",
    button: "Browse Hospitals",
  },

  {
    id: "02",
    title: "Choose a Doctor",
    description:
      "Compare doctors based on specialization, experience, ratings, and availability.",
    icon: Stethoscope,
    link: "/doctors",
    button: "Find Doctors",
  },

  {
    id: "03",
    title: "Book Appointment",
    description:
      "Select your preferred date and time to confirm your appointment in seconds.",
    icon: CalendarCheck2,
    link: "/appointments",
    button: "Book Now",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-white py-24">
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
            Simple Process
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            How It Works
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-500">
            Booking healthcare has never been easier. Follow three simple
            steps to connect with trusted hospitals and expert doctors.
          </p>
        </motion.div>

        {/* Steps */}

        <div className="relative mt-20 grid gap-10 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.2,
                }}
                viewport={{ once: true }}
                className="group relative rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                {/* Number */}

                <div className="absolute right-6 top-6 text-5xl font-extrabold text-slate-100">
                  {step.id}
                </div>

                {/* Icon */}

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                  <Icon className="text-blue-600" size={30} />
                </div>

                {/* Content */}

                <h3 className="mt-8 text-2xl font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-4 leading-8 text-gray-500">
                  {step.description}
                </p>

                {/* Button */}

                <Link
                  to={step.link}
                  className="mt-8 inline-flex items-center gap-2 font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  {step.button}

                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;