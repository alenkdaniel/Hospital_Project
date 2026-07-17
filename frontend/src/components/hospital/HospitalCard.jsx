import { Link } from "react-router-dom";

import { motion } from "framer-motion";

import {
  MapPin,
  Star,
  Ambulance,
  Clock,
} from "lucide-react";

const HospitalCard = ({
  hospital,
  distance,
  duration,
}) => {
  return (

<motion.div
  whileHover={{ y: -2 }}
  transition={{ duration: 0.2 }}
  className="
  relative
  overflow-hidden
  rounded-[26px]
  border
  border-gray-200
  bg-white
  shadow-sm
  hover:shadow-lg
  "
>
  <div className="flex flex-col md:flex-row">

    {/* IMAGE */}

    <div className="relative shrink-0 p-5">

      <img
        src={
          hospital.images?.[0]?.url ||
          "https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=1200"
        }
        alt={hospital.name}
        className="
        h-47.5
        w-52.5
        rounded-2xl
        object-cover
        "
      />

    </div>

    {/* CONTENT */}

    <div className="flex flex-1 flex-col justify-between py-6 pr-6">

      {/* TOP ROW */}

      <div className="relative flex-1 p-8">

        <div>

          <h2 className="text-[28px] leading-tight font-bold text-slate-900">
            {hospital.name}
          </h2>

          {/* Rating */}

          <div className="mt-3 flex flex-wrap items-center gap-4 text-gray-600">

            <div className="flex items-center gap-1">

              <Star
                size={18}
                className="fill-blue-600 text-blue-600"
              />

              <span className="font-semibold text-slate-900">
                {hospital.rating?.average || 0}
              </span>

              <span className="text-gray-500">
                ({hospital.rating?.count || 0} reviews)
              </span>

            </div>

            <span className="text-gray-300">|</span>

            <div className="flex items-center gap-1">

              <MapPin
                size={17}
                className="text-gray-500"
              />

              <span>

                {distance || hospital.address?.city}

              </span>

            </div>

          </div>

        </div>

        {/* BADGE */}

{hospital.emergency?.available && (
  <span
    className="
    absolute
    top-6
    right-6
    rounded-full
    bg-green-600
    px-5
    py-2
    text-sm
    font-semibold
    text-white
    "
  >
    Emergency Available
  </span>
)}

      </div>

      {/* SPECIALITIES */}

      <div className="mt-6 flex flex-wrap gap-3">

        {(hospital.departments || [])
          .slice(0, 4)
          .map((dept, index) => (

            <span
              key={index}
              className="
              rounded-full
              bg-blue-100
              px-4
              py-2
              text-sm
              font-medium
              text-blue-700
              "
            >
              {dept}
            </span>

          ))}

        {(hospital.departments?.length || 0) > 4 && (

          <span
            className="
            rounded-full
            bg-blue-100
            px-4
            py-2
            text-sm
            font-medium
            text-blue-700
            "
          >
            +{hospital.departments.length - 4} more
          </span>

        )}

      </div>
            {/* BOTTOM */}

      <div className="mt-8">

        <div className="flex flex-wrap items-center justify-between gap-6">

          {/* Left Info */}

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">

            <div className="flex items-center gap-2">

              <Ambulance
                size={18}
                className={
                  hospital.emergency?.available
                    ? "text-green-600"
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

                <Clock
                  size={18}
                  className="text-blue-600"
                />

                <span>{duration}</span>

              </div>

            )}

          </div>

          {/* Buttons */}

          <div className="flex flex-1 justify-end gap-4">

            <Link
              to={`/book-appointment/${hospital._id}`}
              className="
              flex
              h-14
              min-w-60
              items-center
              justify-center
              rounded-2xl
              bg-blue-600
              px-8
              font-semibold
              text-white
              transition
              hover:bg-blue-700
              "
            >
              Book Appointment
            </Link>

            <Link
              to={`/hospitals/${hospital._id}`}
              className="
              flex
              h-14
              min-w-60
              items-center
              justify-center
              rounded-2xl
              border-2
              border-blue-600
              bg-white
              px-8
              font-semibold
              text-blue-600
              transition
              hover:bg-blue-50
              "
            >
              View Details
            </Link>

          </div>

        </div>

      </div>

    </div>

  </div>

</motion.div>
  )
}
export default HospitalCard;