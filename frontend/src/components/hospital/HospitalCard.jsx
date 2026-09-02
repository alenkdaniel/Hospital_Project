import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Star,
  Ambulance,
  Clock,
} from "lucide-react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=1200";

const HospitalCard = ({ hospital, distance, duration }) => {
  const rating = hospital.rating?.average || 0;
  const departments = hospital.departments || [];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group flex flex-col overflow-hidden rounded-[22px] border border-ink-100 bg-white shadow-sm transition-shadow hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative">
        <img
          src={hospital.images?.[0]?.url || FALLBACK_IMAGE}
          alt={hospital.name}
          className="h-52 w-full object-cover"
        />

        {/* Rating badge */}
        <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-sm font-semibold text-ink-900 shadow">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          {rating.toFixed(1)}
        </span>

        {/* Emergency badge */}
        {hospital.emergency?.available && (
          <span className="absolute left-4 top-4 rounded-full bg-brand-800/95 px-3 py-1 text-xs font-semibold text-white shadow">
            24/7 ER
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-xl font-bold leading-snug text-ink-900">
          {hospital.name}
        </h2>

        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
          <MapPin size={15} className="text-ink-400" />
          <span>{distance || hospital.address?.city}</span>
          {hospital.address?.district && (
            <>
              <span className="text-ink-300">•</span>
              <span>{hospital.address.district}</span>
            </>
          )}
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {hospital.emergency?.available && (
            <span className="rounded-lg bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              24/7 ER
            </span>
          )}
          {departments.slice(0, 3).map((dept, index) => (
            <span
              key={index}
              className="rounded-lg bg-ink-100 px-3 py-1 text-xs font-medium text-ink-600"
            >
              {dept}
            </span>
          ))}
          {departments.length > 3 && (
            <span className="rounded-lg bg-ink-100 px-3 py-1 text-xs font-medium text-ink-600">
              +{departments.length - 3} more
            </span>
          )}
        </div>

        {duration && (
          <div className="mt-4 flex items-center gap-2 text-sm text-ink-500">
            <Clock size={16} className="text-brand-600" />
            <span>{duration}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 flex gap-3 pt-2">
          <Link
            to={`/hospitals/${hospital._id}`}
            state={{ tab: "overview" }}
            className="flex h-12 flex-1 items-center justify-center rounded-xl border border-ink-200 bg-white text-sm font-semibold text-ink-700 transition hover:border-brand-600 hover:text-brand-700"
          >
            View Details
          </Link>
          <Link
            to={`/hospitals/${hospital._id}`}
            state={{ tab: "doctors" }}
            className="flex h-12 flex-1 items-center justify-center rounded-xl bg-brand-800 text-sm font-semibold text-white transition hover:bg-brand-900"
          >
            Book Consult
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default HospitalCard;