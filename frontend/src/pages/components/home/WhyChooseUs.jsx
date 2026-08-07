import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle2 } from "lucide-react";

import { getHospitals } from "../../../features/hospital/hospitalSlice";
import ScrollReveal from "../../../components/ScrollReveal";

const features = [
  {
    title: "Verified Hospitals",
    description:
      "Every hospital on our platform goes through a super-admin verification review before it's listed.",
  },
  {
    title: "Expert Doctors",
    description:
      "Connect with experienced specialists across multiple medical fields for personalized care.",
  },
  {
    title: "Online Appointments",
    description:
      "Book, track, and reschedule appointments online in just a few clicks.",
  },
  {
    title: "24/7 Emergency Support",
    description:
      "Filter hospitals by emergency and ambulance availability whenever you need help fast.",
  },
];

const WhyChooseUs = () => {
  const dispatch = useDispatch();
  const { total: hospitalTotal } = useSelector((state) => state.hospital);
  const { doctors } = useSelector((state) => state.doctor);

  useEffect(() => {
    dispatch(getHospitals());
  }, [dispatch]);

  return (
    <section className="bg-ink-50 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <ScrollReveal direction="left" className="relative">
            <div className="overflow-hidden rounded-[36px] bg-white p-5 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1600&auto=format&fit=crop"
                alt="Healthcare team reviewing patient records"
                className="h-[420px] w-full rounded-3xl object-cover"
              />
            </div>

            <div className="absolute -bottom-6 left-8 rounded-2xl bg-white p-5 shadow-xl">
              <h3 className="text-lg font-bold text-ink-900">
                Trusted Healthcare
              </h3>
              <p className="mt-2 text-sm text-ink-500">
                {hospitalTotal || 0}+ Hospitals
              </p>
              <p className="text-sm text-ink-500">
                {doctors.length || 0}+ Doctors
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <h2 className="text-4xl font-bold text-ink-900">Why Choose Us?</h2>
            <p className="mt-6 text-lg leading-8 text-ink-500">
              We provide a secure, verified healthcare platform that connects
              patients with trusted hospitals and experienced doctors for a
              better healthcare experience.
            </p>

            <div className="mt-10 space-y-8">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-100">
                    <CheckCircle2 size={26} className="text-brand-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-ink-900">
                      {feature.title}
                    </h3>
                    <p className="mt-2 leading-7 text-ink-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;