import {
  Search,
  MapPin,
  Navigation,
  Loader2,
} from "lucide-react";

const HospitalSearch = ({
  search,
  setSearch,
  city,
  setCity,
  district,
  setDistrict,
  suggestions,
  searchLoading,
  handleSelectLocation,
  handleSearch,
  findNearMe,
}) => {
  return (
    <section className="bg-ink-50">
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-12 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink-900 md:text-5xl">
          Find Premium Care Facilities
        </h1>
        <p className="mt-3 text-lg text-ink-500">
          Discover top-rated hospitals and specialized medical centers near you.
        </p>

        <div className="mt-8 grid gap-3 rounded-3xl border border-ink-100 bg-white p-3 shadow-sm lg:grid-cols-[1.3fr_1fr_1fr_auto_auto]">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by hospital name, condition, or specialty..."
              className="h-14 w-full rounded-2xl border border-transparent bg-ink-50 pl-11 pr-4 text-sm outline-none transition focus:border-brand-600 focus:bg-white"
            />
          </div>

          {/* Location */}
          <div className="relative">
            <MapPin
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
            />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City or area..."
              className="h-14 w-full rounded-2xl border border-transparent bg-ink-50 pl-11 pr-10 text-sm outline-none transition focus:border-brand-600 focus:bg-white"
            />

            {searchLoading && (
              <Loader2
                className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-brand-700"
                size={16}
              />
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-2xl">
                {suggestions.map((place) => (
                  <button
                    key={place.id}
                    type="button"
                    onClick={() => handleSelectLocation(place)}
                    className="flex w-full items-start gap-3 border-b border-ink-100 px-4 py-3 text-left transition last:border-none hover:bg-brand-50"
                  >
                    <MapPin size={16} className="mt-1 shrink-0 text-brand-700" />
                    <div>
                      <p className="text-sm font-medium text-ink-800">
                        {place.text}
                      </p>
                      <p className="text-xs text-ink-500">{place.place_name}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* District */}
          <div className="relative">
            <MapPin
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
            />
            <input
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="District, e.g. Ernakulam"
              className="h-14 w-full rounded-2xl border border-transparent bg-ink-50 pl-11 pr-4 text-sm outline-none transition focus:border-brand-600 focus:bg-white"
            />
          </div>

          {/* Search button */}
          <button
            onClick={handleSearch}
            className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-brand-800 px-7 text-sm font-semibold text-white transition hover:bg-brand-900"
          >
            <Search size={18} />
            Search
          </button>

          {/* Near me */}
          <button
            onClick={findNearMe}
            title="Find near me"
            className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-700 text-brand-700 transition hover:bg-brand-50"
          >
            <Navigation size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HospitalSearch;