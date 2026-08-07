import { Link } from "react-router-dom";
import { Building2, Stethoscope, TriangleAlert, ArrowRight } from "lucide-react";
import ScrollReveal from "../../../components/ScrollReveal";

// Every link below points to a route that actually exists in
// AppRoutes.jsx — Emergency reuses the Hospitals page's own
// emergency filter instead of a standalone page that doesn't exist.
const services = [
  {
    id: 1,
    title: "Hospitals",
    description:
      "Find verified hospitals with state-of-the-art facilities and modern equipment near your location.",
    icon: Building2,
    link: "/hospitals",
    button: "Explore Hospitals",
    accent: "brand",
  },
  {
    id: 2,
    title: "Doctors",
    description:
      "Meet expert doctors from diverse specialties committed to providing personalized patient care.",
    icon: Stethoscope,
    link: "/doctors",
    button: "Book Appointment",
    accent: "brand",
  },
  {
    id: 3,
    title: "Emergency",
    description:
      "24/7 medical support — instantly filter for hospitals with emergency and ambulance services nearby.",
    icon: TriangleAlert,
    link: "/hospitals?emergency=true",
    button: "Find Emergency Care",
    accent: "red",
  },
];

const Services = () => {
  return (
    <section id="services" className="scroll-mt-24 bg-ink-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal className="text-center">
          <span className="inline-flex rounded-full bg-brand-100 px-4 py-2 text-sm font-semibold text-brand-700">
            Departments
          </span>
          <h2 className="mt-6 text-4xl font-bold text-ink-900">
            Comprehensive Care Services
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-500">
            Connecting patients with trusted healthcare through our network
            of premium medical facilities and specialized services.
          </p>
        </ScrollReveal>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isRed = service.accent === "red";

            return (
              <ScrollReveal key={service.id} delay={index * 0.12}>
                <div className="group h-full rounded-3xl bg-white p-8 shadow-sm ring-1 ring-ink-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                      isRed ? "bg-red-100" : "bg-brand-100"
                    }`}
                  >
                    <Icon
                      className={isRed ? "text-red-600" : "text-brand-700"}
                      size={30}
                    />
                  </div>

                  <h3 className="mt-8 text-2xl font-bold text-ink-900">
                    {service.title}
                  </h3>

                  <p className="mt-4 leading-7 text-ink-500">
                    {service.description}
                  </p>

                  <Link
                    to={service.link}
                    className={`mt-8 inline-flex items-center gap-2 font-semibold ${
                      isRed ? "text-red-600" : "text-brand-700"
                    }`}
                  >
                    {service.button}
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;