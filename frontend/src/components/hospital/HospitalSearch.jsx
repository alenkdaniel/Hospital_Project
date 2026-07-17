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
  suggestions,
  searchLoading,
  handleSelectLocation,
  handleSearch,
  findNearMe,
}) => {
  return (
    <section className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">

        <div className="grid lg:grid-cols-[1.4fr_1.4fr_220px] gap-5">

          {/* Search */}

          <div>
            <label className="block mb-3 text-sm font-semibold text-gray-700">
              Specialty or Hospital Name
            </label>

            <div className="relative">

              <Search
                size={20}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="e.g. Cardiology, Apollo Hospital"
                className="
                w-full
                rounded-2xl
                border
                border-gray-300
                bg-white
                py-4
                pl-14
                pr-5
                outline-none
                transition
                focus:border-blue-600
                "
              />
            </div>
          </div>

          {/* Location */}

          <div className="relative">

            <label className="block mb-3 text-sm font-semibold text-gray-700">
              Location
            </label>

            <div className="relative">

              <MapPin
                size={20}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Search city..."
                className="
                w-full
                rounded-2xl
                border
                border-gray-300
                bg-white
                py-4
                pl-14
                pr-12
                outline-none
                transition
                focus:border-blue-600
                "
              />

              {searchLoading && (
                <Loader2
                  className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-blue-600"
                  size={18}
                />
              )}
            </div>

            {/* Suggestions */}

            {suggestions.length > 0 && (
              <div
                className="
                absolute
                left-0
                right-0
                top-full
                mt-2
                overflow-hidden
                rounded-2xl
                border
                bg-white
                shadow-2xl
                z-50
                "
              >
                {suggestions.map((place) => (
                  <button
                    key={place.id}
                    type="button"
                    onClick={() => handleSelectLocation(place)}
                    className="
                    flex
                    w-full
                    items-start
                    gap-4
                    px-5
                    py-4
                    text-left
                    transition
                    hover:bg-blue-50
                    border-b
                    last:border-none
                    "
                  >
                    <MapPin
                      size={18}
                      className="mt-1 text-blue-600"
                    />

                    <div>

                      <p className="font-medium text-gray-800">
                        {place.text}
                      </p>

                      <p className="text-sm text-gray-500">
                        {place.place_name}
                      </p>

                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}

          <div className="flex items-end gap-3">

            <button
              onClick={handleSearch}
              className="
              flex-1
              rounded-2xl
              bg-blue-600
              py-4
              font-semibold
              text-white
              transition
              hover:bg-blue-700
              "
            >
              Search Facilities
            </button>

            <button
              onClick={findNearMe}
              className="
              flex
              h-[58px]
              w-[58px]
              items-center
              justify-center
              rounded-2xl
              border
              border-blue-600
              text-blue-600
              transition
              hover:bg-blue-50
              "
            >
              <Navigation size={22} />
            </button>

          </div>

        </div>

      </div>
    </section>
  );
};

export default HospitalSearch;