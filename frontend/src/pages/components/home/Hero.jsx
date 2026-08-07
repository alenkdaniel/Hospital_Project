import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, BadgeCheck, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Ambient background blobs */}
      <div className="pointer-events-none absolute -top-40 -left-32 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl" />
      <div className="pointer-events-none absolute top-40 right-0 h-80 w-80 rounded-full bg-brand-100 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-14 lg:grid lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-8 lg:pb-28 lg:pt-20">
        {/* Left column */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
            <Sparkles size={16} />
            24/7 Emergency Care Available
          </div>

          <h1 className="mt-7 text-5xl font-extrabold leading-[1.08] text-ink-900 sm:text-6xl">
            World-Class Care,
            <br />
            <span className="text-brand-600">Seconds Away.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-ink-500">
            Search verified hospitals, compare expert doctors and manage
            every step of your healthcare journey from one trusted
            platform.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 rounded-2xl bg-brand-800 px-7 py-4 font-semibold text-white shadow-lg shadow-brand-800/20 transition hover:-translate-y-0.5 hover:bg-brand-900"
            >
              Book Appointment
              <ArrowRight size={18} />
            </Link>

            
              <a href="#services"
              className="inline-flex items-center gap-2 rounded-2xl border border-ink-200 bg-white px-7 py-4 font-semibold text-ink-800 transition hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700"
            >
              Our Services
            </a>
          </div>

          {/* Stats row */}
          <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6 border-t border-ink-100 pt-8">
            <div>
              <p className="text-3xl font-extrabold text-ink-900">500+</p>
              <p className="mt-1 text-sm font-medium uppercase tracking-wide text-ink-400">
                Specialists
              </p>
            </div>

            <div>
              <p className="text-3xl font-extrabold text-ink-900">98%</p>
              <p className="mt-1 text-sm font-medium uppercase tracking-wide text-ink-400">
                Patient Satisfaction
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-ink-50 px-4 py-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-ink-900">
                  Verified Experts
                </p>
                <p className="text-xs text-ink-500">
                  Board-certified doctors
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right column */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative mt-16 lg:mt-0"
        >
          <div className="overflow-hidden rounded-[36px] border-8 border-white shadow-2xl shadow-ink-900/10">
            <img
              src="https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=1600&auto=format&fit=crop"
              alt="Doctors reviewing patient care in a modern hospital"
              className="h-[520px] w-full object-cover"
            />
          </div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -left-6 flex items-center gap-4 rounded-2xl bg-white px-6 py-5 shadow-2xl sm:-left-10"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white">
              <BadgeCheck />
            </div>
            <div>
              <h3 className="font-bold text-ink-900">Verified Excellence</h3>
              <p className="text-sm text-ink-500">99.9% Uptime Care Network</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;