import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PhoneCall,
  Ambulance,
  Clock3,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const EmergencyBanner = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[40px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-10 lg:p-16 text-white"
        >
          {/* Background Blur */}

          <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>

          <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl"></div>

          <div className="relative grid items-center gap-12 lg:grid-cols-2">
            {/* Left */}

            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                <Ambulance size={18} />
                24/7 Emergency Support
              </div>

              <h2 className="mt-6 text-4xl md:text-5xl font-bold leading-tight">
                Need Emergency Medical Help?
              </h2>

              <p className="mt-6 max-w-xl text-lg text-blue-100">
                Find the nearest emergency hospitals, connect with medical
                professionals instantly, and receive quick healthcare
                assistance whenever you need it.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="tel:+918000000000"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-semibold text-blue-700 transition hover:bg-blue-50"
                >
                  <PhoneCall size={20} />
                  Call Emergency
                </a>

                <Link
                  to="/hospitals?emergency=true"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-7 py-4 font-semibold transition hover:bg-white/10"
                >
                  Find Hospitals
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* Right */}

            <div className="grid grid-cols-2 gap-5">
              <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
                <Clock3 className="text-white" size={34} />

                <h3 className="mt-5 text-3xl font-bold">
                  24/7
                </h3>

                <p className="mt-2 text-blue-100">
                  Emergency Support
                </p>
              </div>

              <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
                <ShieldCheck className="text-white" size={34} />

                <h3 className="mt-5 text-3xl font-bold">
                  Verified
                </h3>

                <p className="mt-2 text-blue-100">
                  Hospitals
                </p>
              </div>

              <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
                <Ambulance className="text-white" size={34} />

                <h3 className="mt-5 text-3xl font-bold">
                  Fast
                </h3>

                <p className="mt-2 text-blue-100">
                  Ambulance Access
                </p>
              </div>

              <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
                <PhoneCall className="text-white" size={34} />

                <h3 className="mt-5 text-3xl font-bold">
                  Instant
                </h3>

                <p className="mt-2 text-blue-100">
                  Medical Assistance
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EmergencyBanner;