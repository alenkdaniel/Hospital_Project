import { ChevronDown } from "lucide-react";

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "rating", label: "Highest Rated" },
  { value: "distance", label: "Nearest" },
  { value: "name", label: "Name (A-Z)" },
];

const HospitalSort = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-ink-500">Sort by:</span>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 cursor-pointer appearance-none rounded-xl border border-ink-200 bg-white pl-4 pr-10 text-sm font-medium text-ink-800 outline-none transition focus:border-brand-600"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400"
        />
      </div>
    </div>
  );
};

export default HospitalSort;