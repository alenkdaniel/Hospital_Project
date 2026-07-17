import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, BadgeCheck } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-blue-200">
      {/* Background Blur */}
      <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl"></div>

      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Badge */}

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
              <ShieldCheck size={18} />
              Trusted Healthcare Platform
            </div>

            {/* Heading */}

            <h1 className="mt-8 text-5xl md:text-6xl font-extrabold leading-tight text-slate-900">
              Find The{" "}
              <span className="text-blue-600">
                Best Hospitals
              </span>
              <br />
              Near You
            </h1>

            {/* Description */}

            <p className="mt-8 max-w-xl text-lg leading-8 text-gray-600">
              Search hospitals, discover expert doctors and manage your
              healthcare journey easily from one professional platform.
            </p>

            {/* Buttons */}

            <div className="mt-10 flex flex-wrap gap-5">
              <Link
                to="/hospitals"
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
              >
                Find Hospital

                <ArrowRight size={20} />
              </Link>

              <Link
                to="/about"
                className="rounded-xl border bg-white px-8 py-4 font-semibold text-slate-800 shadow-sm transition hover:shadow-lg"
              >
                Learn More
              </Link>
            </div>
          </motion.div>

          {/* Right */}

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Image */}

            <div className="overflow-hidden rounded-[35px] border-8 border-white shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=1600"
                alt="Hospital"
                className="h-[600px] w-full object-cover"
              />
            </div>

            {/* Floating Card */}

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              className="absolute bottom-10 -left-8 flex items-center gap-4 rounded-2xl bg-white px-6 py-5 shadow-2xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white">
                <BadgeCheck />
              </div>

              <div>
                <h3 className="font-bold text-slate-800">
                  Verified Excellence
                </h3>

                <p className="text-gray-500">
                  99.9% Patient Satisfaction
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;