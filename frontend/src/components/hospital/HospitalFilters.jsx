import { useRef, useState } from "react";
import {
  Star,
  Ambulance,
  HeartPulse,
  Building2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-ink-100 py-6 first:pt-0 last:border-none last:pb-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left"
      >
        <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
        {open ? (
          <ChevronUp size={18} className="text-ink-400" />
        ) : (
          <ChevronDown size={18} className="text-ink-400" />
        )}
      </button>

      {open && <div className="mt-5">{children}</div>}
    </div>
  );
};

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
  userCoords,
}) => {
  // ⭐ Show visual feedback (smooth dragging) without triggering API calls
  // The parent Hospitals.jsx has debounced the actual filter, so we can update
  // the UI instantly for responsive feel
  const sliderRef = useRef(null);

  const hasActiveFilters =
    rating !== 0 || emergency || icu || acceptingPatients || distance !== 25;

  const clearAll = () => {
    setRating(0);
    setEmergency(false);
    setIcu(false);
    setAcceptingPatients(false);
    setDistance(25);
  };

  return (
    <aside className="rounded-3xl border border-ink-100 bg-white p-7 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-ink-900">Filters</h2>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-sm font-semibold text-brand-700 transition hover:text-brand-900"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Rating */}
      <FilterSection title="Minimum Rating">
        <div className="space-y-3">
          {[4.5, 4, 0].map((item) => (
            <label
              key={item}
              className="flex cursor-pointer items-center gap-3 text-sm text-ink-700"
            >
              <input
                type="radio"
                checked={rating === item}
                onChange={() => setRating(item)}
                className="h-5 w-5 accent-brand-700"
              />

              <span className="flex items-center gap-2">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                {item === 0 ? "Any Rating" : `${item}+ Stars`}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Distance */}
      <FilterSection title="Distance">
        {!userCoords ? (
          <div className="rounded-xl border border-brand-200 bg-brand-50 p-3 text-sm text-brand-800">
            📍 Select a location first to filter by distance
          </div>
        ) : (
          <>
            <div className="relative">
              <input
                ref={sliderRef}
                type="range"
                min="1"
                max="100"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full cursor-pointer accent-brand-700 transition-all hover:accent-brand-800"
              />
            </div>

            <div className="mt-3 flex justify-between text-sm text-ink-500">
              <span>1 km</span>
              <span className="font-semibold text-brand-700 transition-colors">
                {distance} km
              </span>
              <span>100 km</span>
            </div>

            <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink-100">
              <div
                className="h-full bg-brand-700 transition-all duration-300"
                style={{ width: `${(distance / 100) * 100}%` }}
              />
            </div>
          </>
        )}
      </FilterSection>

      {/* Facilities */}
      <FilterSection title="Facilities">
        <div className="space-y-4">
          <label className="flex cursor-pointer items-center gap-3 text-sm text-ink-700">
            <input
              type="checkbox"
              checked={emergency}
              onChange={() => setEmergency(!emergency)}
              className="h-5 w-5 accent-brand-700"
            />

            <Ambulance size={18} className="text-red-500" />
            Emergency 24/7
          </label>

          <label className="flex cursor-pointer items-center gap-3 text-sm text-ink-700">
            <input
              type="checkbox"
              checked={icu}
              onChange={() => setIcu(!icu)}
              className="h-5 w-5 accent-brand-700"
            />

            <HeartPulse size={18} className="text-brand-700" />
            ICU Available
          </label>
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability">
        <label className="flex cursor-pointer items-center gap-3 text-sm text-ink-700">
          <input
            type="checkbox"
            checked={acceptingPatients}
            onChange={() => setAcceptingPatients(!acceptingPatients)}
            className="h-5 w-5 accent-brand-700"
          />

          <Building2 size={18} className="text-brand-700" />
          Accepting New Patients
        </label>
      </FilterSection>
    </aside>
  );
};

export default HospitalFilters;