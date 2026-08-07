import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CalendarCheck2 } from "lucide-react";

import { getDoctors } from "../../../features/doctor/doctorSlice";
import ScrollReveal from "../../../components/ScrollReveal";

const FALLBACK_IMAGE =
  "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";

const Specialists = () => {
  const dispatch = useDispatch();
  const { doctors } = useSelector((state) => state.doctor);

  useEffect(() => {
    dispatch(getDoctors());
  }, [dispatch]);

  // Highlight the four most experienced doctors on the network —
  // real records from the /doctors API, not placeholder profiles.
  const featured = [...doctors]
    .sort((a, b) => (b.experience || 0) - (a.experience || 0))
    .slice(0, 4);

  if (!doctors.length) return null;

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal className="text-center">
          <span className="inline-flex rounded-full bg-brand-100 px-4 py-2 text-sm font-semibold text-brand-700">
            Our Network
          </span>
          <h2 className="mt-6 text-4xl font-bold text-ink-900">
            Medical Specialists
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-ink-500">
            Our team of verified specialists is dedicated to your health
            across every medical discipline.
          </p>
        </ScrollReveal>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((doctor, index) => (
            <ScrollReveal key={doctor._id} delay={index * 0.1}>
              <div className="group h-full overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-ink-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="overflow-hidden">
                  <img
                    src={doctor.image || FALLBACK_IMAGE}
                    alt={doctor.name}
                    className="h-64 w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-ink-900">
                    Dr. {doctor.name}
                  </h3>
                  <p className="mt-1 font-semibold text-brand-700">
                    {doctor.specialization}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-ink-500">
                    {doctor.experience}+ years experience
                    {doctor.hospital?.name ? ` · ${doctor.hospital.name}` : ""}
                  </p>

                  <Link
                    to={`/book-appointment/${doctor._id}`}
                    className="mt-5 inline-flex items-center gap-2 font-semibold text-brand-700 transition hover:text-brand-800"
                  >
                    <CalendarCheck2 size={18} />
                    Book Appointment
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-16 text-center" delay={0.2}>
          <Link
            to="/doctors"
            className="inline-flex items-center rounded-xl bg-brand-800 px-8 py-4 font-semibold text-white transition hover:bg-brand-900"
          >
            View All Doctors
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Specialists;