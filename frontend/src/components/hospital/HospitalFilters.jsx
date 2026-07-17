import {
  Star,
  Ambulance,
  HeartPulse,
  Building2,
} from "lucide-react";

const HospitalFilters = ({
  rating,
  setRating,
  distance,
  setDistance,
  emergency,
  setEmergency,
  icu,
  setIcu,
  acceptingPatients,
  setAcceptingPatients,
}) => {
  return (
    <aside className="
      rounded-3xl
      bg-white
      shadow-sm
      p-8
      ">

      <h2 className="text-3xl font-bold mb-8">
        Filters
      </h2>

      {/* Rating */}

      <div className="mb-8">

        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Minimum Rating
        </h3>

        <div className="space-y-3">

          {[4.5, 4, 0].map((item) => (
            <label
              key={item}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="radio"
                checked={rating === item}
                onChange={() => setRating(item)}
                className="h-5 w-5 accent-blue-600"
              />

              <span className="flex items-center gap-2">

                <Star
                  size={16}
                  className="fill-yellow-400 text-yellow-400"
                />

                {item === 0
                  ? "Any Rating"
                  : `${item}+ Stars`}
              </span>

            </label>
          ))}

        </div>

      </div>

      {/* Distance */}

      <div className="mb-8">

        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Distance
        </h3>

        <input
          type="range"
          min="1"
          max="50"
          value={distance}
          onChange={(e) =>
            setDistance(Number(e.target.value))
          }
          className="w-full accent-blue-600"
        />

        <div className="mt-3 flex justify-between text-sm text-gray-500">
          <span>1 km</span>

          <span>{distance} km</span>

          <span>50 km</span>
        </div>

      </div>

      {/* Facilities */}

      <div className="mb-8">

        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Facilities
        </h3>

        <div className="space-y-4">

          <label className="flex items-center gap-3 cursor-pointer">

            <input
              type="checkbox"
              checked={emergency}
              onChange={() =>
                setEmergency(!emergency)
              }
              className="h-5 w-5 accent-blue-600"
            />

            <Ambulance
              size={18}
              className="text-red-500"
            />

            Emergency 24/7

          </label>

          <label className="flex items-center gap-3 cursor-pointer">

            <input
              type="checkbox"
              checked={icu}
              onChange={() =>
                setIcu(!icu)
              }
              className="h-5 w-5 accent-blue-600"
            />

            <HeartPulse
              size={18}
              className="text-blue-600"
            />

            ICU Available

          </label>

        </div>

      </div>

      {/* Availability */}

      <div>

        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Availability
        </h3>

        <label className="flex items-center gap-3 cursor-pointer">

          <input
            type="checkbox"
            checked={acceptingPatients}
            onChange={() =>
              setAcceptingPatients(
                !acceptingPatients
              )
            }
            className="h-5 w-5 accent-blue-600"
          />

          <Building2
            size={18}
            className="text-green-600"
          />

          Accepting New Patients

        </label>

      </div>

    </aside>
  );
};

export default HospitalFilters;