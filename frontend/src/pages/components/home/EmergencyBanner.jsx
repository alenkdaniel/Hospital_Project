import { Link } from "react-router-dom";
import { PhoneCall, Ambulance, Clock3, ShieldCheck, ArrowRight } from "lucide-react";
import ScrollReveal from "../../../components/ScrollReveal";

const EmergencyBanner = () => {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 p-10 text-white lg:p-16">
            <div className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-brand-300/20 blur-3xl" />

            <div className="relative grid items-center gap-12 lg:grid-cols-2">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                  <Ambulance size={18} />
                  24/7 Emergency Support
                </div>

                <h2 className="mt-6 text-4xl font-bold leading-tight md:text-5xl">
                  Need Immediate Assistance?
                </h2>

                <p className="mt-6 max-w-xl text-lg text-brand-50">
                  Find the nearest emergency-ready hospitals and reach
                  medical help instantly, wherever you are.
                </p>

                <div className="mt-10 flex flex-wrap gap-4">
                  
                    <a href="tel:+918000000000"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-semibold text-brand-800 transition hover:bg-brand-50"
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

              <div className="grid grid-cols-2 gap-5">
                {[
                  { icon: Clock3, title: "24/7", label: "Emergency Support" },
                  { icon: ShieldCheck, title: "Verified", label: "Hospitals" },
                  { icon: Ambulance, title: "Fast", label: "Ambulance Access" },
                  { icon: PhoneCall, title: "Instant", label: "Medical Assistance" },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl bg-white/10 p-6 backdrop-blur">
                    <item.icon className="text-white" size={32} />
                    <h3 className="mt-5 text-3xl font-bold">{item.title}</h3>
                    <p className="mt-2 text-brand-50">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default EmergencyBanner;