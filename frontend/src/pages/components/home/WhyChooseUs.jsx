import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const features = [
  {
    title: "Verified Hospitals",
    description:
      "Every hospital on our platform is verified for quality, safety, and trusted healthcare services.",
  },
  {
    title: "Expert Doctors",
    description:
      "Connect with experienced specialists across multiple medical fields for personalized care.",
  },
  {
    title: "Online Appointments",
    description:
      "Book, manage, and reschedule appointments online in just a few clicks.",
  },
  {
    title: "24/7 Emergency Support",
    description:
      "Quickly locate emergency hospitals and receive immediate medical assistance anytime.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left Image */}

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="overflow-hidden rounded-[36px] bg-white p-5 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1600&auto=format&fit=crop"
                alt="Healthcare"
                className="h-[420px] w-full rounded-3xl object-cover"
              />
            </div>

            {/* Floating Card */}

            <div className="absolute -bottom-6 left-8 rounded-2xl bg-white p-5 shadow-xl">
              <h3 className="text-lg font-bold text-slate-900">
                Trusted Healthcare
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                500+ Hospitals
              </p>

              <p className="text-sm text-gray-500">
                10,000+ Doctors
              </p>
            </div>
          </motion.div>

          {/* Right */}

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-slate-900">
              Why Choose Us?
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              We provide a secure and seamless healthcare platform that
              connects patients with trusted hospitals and experienced
              doctors for a better healthcare experience.
            </p>

            <div className="mt-10 space-y-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-5"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2
                      size={28}
                      className="text-green-600"
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      {feature.title}
                    </h3>

                    <p className="mt-2 leading-7 text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;