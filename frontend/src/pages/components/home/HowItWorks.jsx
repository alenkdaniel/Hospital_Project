import { Link } from "react-router-dom";
import { Search, Stethoscope, CalendarCheck2, ArrowRight } from "lucide-react";
import ScrollReveal from "../../../components/ScrollReveal";

// Step 3 used to link to "/appointments", a route that doesn't
// exist in AppRoutes.jsx. Booking always starts by picking a
// doctor, so it now points at the real /doctors listing.
const steps = [
  {
    id: "01",
    title: "Search Hospitals",
    description:
      "Browse verified hospitals by location, department, distance, or emergency availability.",
    icon: Search,
    link: "/hospitals",
    button: "Browse Hospitals",
  },
  {
    id: "02",
    title: "Choose a Doctor",
    description:
      "Compare doctors by specialization, experience, and consultation fee.",
    icon: Stethoscope,
    link: "/doctors",
    button: "Find Doctors",
  },
  {
    id: "03",
    title: "Book Appointment",
    description:
      "Pick a doctor, choose an available slot, and confirm your appointment in seconds.",
    icon: CalendarCheck2,
    link: "/doctors",
    button: "Book Now",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal className="text-center">
          <span className="rounded-full bg-brand-100 px-4 py-2 text-sm font-semibold text-brand-700">
            Simple Process
          </span>
          <h2 className="mt-6 text-4xl font-bold text-ink-900">
            How It Works
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-500">
            Booking healthcare has never been easier. Follow three simple
            steps to connect with trusted hospitals and expert doctors.
          </p>
        </ScrollReveal>

        <div className="mt-20 grid gap-10 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <ScrollReveal key={step.id} delay={index * 0.15}>
                <div className="group relative h-full rounded-3xl border border-ink-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <div className="absolute right-6 top-6 text-5xl font-extrabold text-ink-100">
                    {step.id}
                  </div>

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100">
                    <Icon className="text-brand-700" size={30} />
                  </div>

                  <h3 className="mt-8 text-2xl font-bold text-ink-900">
                    {step.title}
                  </h3>

                  <p className="mt-4 leading-7 text-ink-500">
                    {step.description}
                  </p>

                  <Link
                    to={step.link}
                    className="mt-8 inline-flex items-center gap-2 font-semibold text-brand-700 transition hover:text-brand-800"
                  >
                    {step.button}
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

export default HowItWorks;