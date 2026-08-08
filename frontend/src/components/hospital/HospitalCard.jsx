import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Star, Ambulance, Clock, PhoneCall, ArrowRight } from "lucide-react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=1200";

const HospitalCard = ({ hospital, distance, duration }) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="relative overflow-hidden rounded-[26px] border border-ink-100 bg-white shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative shrink-0 p-5">
          <img
            src={hospital.images?.[0]?.url || FALLBACK_IMAGE}
            alt={hospital.name}
            className="h-48 w-full rounded-2xl object-cover md:h-full md:w-52"
          />
          {hospital.emergency?.available && (
            <span className="absolute left-8 top-8 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white shadow">
              Emergency Ready
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-6 md:py-6 md:pr-6 md:pl-0">
          <div>
            <h2 className="text-2xl font-bold leading-tight text-ink-900">
              {hospital.name}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-ink-500">
              <div className="flex items-center gap-1">
                <Star size={18} className="fill-brand-600 text-brand-600" />
                <span className="font-semibold text-ink-900">
                  {hospital.rating?.average || 0}
                </span>
                <span className="text-ink-400">
                  ({hospital.rating?.count || 0} reviews)
                </span>
              </div>
              <span className="text-ink-200">|</span>
              <div className="flex items-center gap-1">
                <MapPin size={17} className="text-ink-400" />
                <span>{distance || hospital.address?.city}</span>
              </div>
            </div>

            {/* Departments */}
            <div className="mt-5 flex flex-wrap gap-2">
              {(hospital.departments || []).slice(0, 4).map((dept, index) => (
                <span
                  key={index}
                  className="rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700"
                >
                  {dept}
                </span>
              ))}
              {(hospital.departments?.length || 0) > 4 && (
                <span className="rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700">
                  +{hospital.departments.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* Bottom row */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-5 text-sm text-ink-500">
              <div className="flex items-center gap-2">
                <Ambulance
                  size={18}
                  className={
                    hospital.emergency?.available
                      ? "text-brand-600"
                      : "text-red-500"
                  }
                />
                <span>
                  {hospital.emergency?.available
                    ? "24/7 Emergency"
                    : "Emergency Unavailable"}
                </span>
              </div>
              {duration && (
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-brand-600" />
                  <span>{duration}</span>
                </div>
              )}
              {hospital.contact?.phone && (
                
                 <a href={`tel:${hospital.contact.phone}`}
                  className="flex items-center gap-2 hover:text-brand-700"
                >
                  <PhoneCall size={18} className="text-brand-600" />
                  <span>Call</span>
                </a>
              )}
            </div>

            {/* "View Doctors & Book" jumps straight to the Doctors
                tab on the hospital's page; "Details" opens on the
                Overview tab. Both land on the same page, just a
                different starting tab. */}
            <div className="flex flex-1 justify-end gap-3">
              <Link
                to={`/hospitals/${hospital._id}`}
                state={{ tab: "doctors" }}
                className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-brand-800 px-6 font-semibold text-white transition hover:bg-brand-900"
              >
                View Doctors & Book
                <ArrowRight size={16} />
              </Link>
              <Link
                to={`/hospitals/${hospital._id}`}
                state={{ tab: "overview" }}
                className="flex h-12 items-center justify-center rounded-2xl border-2 border-brand-700 bg-white px-6 font-semibold text-brand-700 transition hover:bg-brand-50"
              >
                Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HospitalCard;