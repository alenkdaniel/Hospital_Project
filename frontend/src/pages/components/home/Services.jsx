import { Link } from "react-router-dom";

import { motion } from "framer-motion";

import {
  Building2,
  Stethoscope,
  TriangleAlert,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    id: 1,

    title: "Hospitals",

    description:
      "Find verified hospitals with state-of-the-art facilities and modern equipment near your location.",

    icon: Building2,

    link: "/hospitals",

    button: "Explore",

    iconBg: "bg-blue-100",

    iconColor: "text-blue-600",

    buttonColor: "text-blue-600",
  },

  {
    id: 2,

    title: "Doctors",

    description:
      "Meet expert doctors from diverse specialties committed to providing personalized patient care.",

    icon: Stethoscope,

    link: "/doctors",

    button: "Book Appointment",

    iconBg: "bg-blue-100",

    iconColor: "text-blue-600",

    buttonColor: "text-blue-600",
  },

  {
    id: 3,

    title: "Emergency",

    description:
      "24/7 medical support and rapid response teams for critical healthcare needs and urgent care.",

    icon: TriangleAlert,

    link: "/emergency",

    button: "Get Help Now",

    iconBg: "bg-red-100",

    iconColor: "text-red-600",

    buttonColor: "text-red-600",
  },
];

const Services = () => {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold text-slate-900">
            Our Care
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-500">
            Connecting patients with trusted healthcare through our network
            of premium medical facilities and specialized services.
          </p>
        </motion.div>

        {/* Cards */}

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                }}
                viewport={{ once: true }}
                className="group rounded-3xl bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                {/* Icon */}

                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl ${service.iconBg}`}
                >
                  <Icon
                    className={`${service.iconColor}`}
                    size={30}
                  />
                </div>

                {/* Title */}

                <h3 className="mt-8 text-3xl font-bold text-slate-900">
                  {service.title}
                </h3>

                {/* Description */}

                <p className="mt-5 text-gray-500 leading-8">
                  {service.description}
                </p>

                {/* Link */}

                <Link
                  to={service.link}
                  className={`mt-8 inline-flex items-center gap-2 font-semibold ${service.buttonColor}`}
                >
                  {service.button}

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

export default Services;