import axios from "axios";

import { useEffect, useState, useRef, useMemo } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  getHospitals,
  searchHospitals,
  resetHospital,
} from "../../features/hospital/hospitalSlice";

import HospitalSearch from "../../components/hospital/HospitalSearch";

import HospitalFilters from "../../components/hospital/HospitalFilters";

import HospitalCard from "../../components/hospital/HospitalCard";

import HospitalSort from "../../components/hospital/HospitalSort";

const Hospitals = () => {

  const dispatch = useDispatch();

  const {
    hospitals,

    isLoading,

    isError,

    message,
  } = useSelector((state) => state.hospital);

  const [search, setSearch] = useState("");

  const [city, setCity] = useState("");

  // ⭐ DISTRICT SEARCH — separate from `city` on purpose: a
  // district search should pull in hospitals from every city
  // inside that district, so it can't just reuse the city
  // filter. Results are grouped by city for display below.

  const [district, setDistrict] = useState("");

  const [suggestions, setSuggestions] = useState([]);

  const [searchLoading, setSearchLoading] = useState(false);

  const [rating, setRating] = useState(0);

  const [distance, setDistance] = useState(25);

  const [emergency, setEmergency] = useState(false);

  const [icu, setIcu] = useState(false);

  const [acceptingPatients, setAcceptingPatients] = useState(false);

  // ⭐ Coordinates driving the current geo-distance search —
  // either from the browser's GPS ("Find Near Me") or from the
  // place the user picked in the Mapbox autocomplete below.

  const [userCoords, setUserCoords] = useState(null);

  // Display-only sort — applied on the client to whatever the
  // current result set is, so it works the same whether we're
  // looking at a plain search or a geo/district result.
  const [sortBy, setSortBy] = useState("recommended");

  const ITEMS_PER_PAGE = 6;

  const [currentPage, setCurrentPage] = useState(1);

  const isFirstRender = useRef(true);

  // ⭐ Debounce timer for distance slider to prevent glitchy UI
  const distanceTimeoutRef = useRef(null);

  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  // =====================================
  // LOAD HOSPITALS
  // =====================================

  useEffect(() => {
    dispatch(getHospitals());

    return () => {
      dispatch(resetHospital());
    };
  }, [dispatch]);

  useEffect(() => {

    if (city.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const searchPlaces = async () => {

      try {

        setSearchLoading(true);

        const response = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json`,
          {
            params: {
              access_token: MAPBOX_TOKEN,
              autocomplete: true,
              limit: 5,
              country: "IN",
            },
          }
        );

        setSuggestions(response.data.features);

      } catch (error) {

        console.log(error);

      } finally {

        setSearchLoading(false);

      }

    };

    searchPlaces();

  }, [city]);

  useEffect(() => {

    window.scrollTo({

      top: 0,

      behavior: "smooth",

    });

  }, [currentPage]);

  // =====================================
  // AUTO FILTER (Rating, Emergency, ICU, Accepting Patients)
  // =====================================

  useEffect(() => {

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setCurrentPage(1);

    fetchHospitals();

  }, [
    rating,
    emergency,
    icu,
    acceptingPatients,
  ]);

  // =====================================
  // DEBOUNCED DISTANCE FILTER
  // Prevents glitchy UI from rapid slider movements
  // =====================================

  useEffect(() => {

    if (isFirstRender.current) {
      return;
    }

    // ⭐ Distance filter only works with GPS coordinates
    if (distance !== 25 && !userCoords) {
      return;
    }

    // Clear previous timeout
    if (distanceTimeoutRef.current) {
      clearTimeout(distanceTimeoutRef.current);
    }

    // Set new timeout — only apply filter after user stops dragging (500ms)
    distanceTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1);
      fetchHospitals();
    }, 500);

    // Cleanup
    return () => {
      if (distanceTimeoutRef.current) {
        clearTimeout(distanceTimeoutRef.current);
      }
    };

  }, [distance, userCoords]);

  // =====================================
  // COMMON SEARCH
  // =====================================

  const fetchHospitals = () => {
    // A district search should show every hospital in that
    // district — it must never be narrowed by a leftover city
    // pick or GPS radius from the separate Location field. That
    // combination is the actual bug: searching "Chengannur" in
    // Location, then "Alappuzha" in District, silently kept the
    // old city + 25km-radius filters and collapsed the results
    // down to just the one hospital that satisfied all three.
    const isDistrictSearch = district.trim().length > 0;

     dispatch(
    searchHospitals({
      search,
      city,
      district,
      rating,
      emergency,
      icu,
      acceptingPatients,

      // Apply geo search only when district search is NOT active
      ...(userCoords && !district
        ? {
            lat: userCoords.lat,
            lng: userCoords.lng,
            distance,
          }
        : {}),
    })
  );
  };

  // District and Location are mutually exclusive search modes —
  // typing a district clears whatever city/GPS pick was active,
  // so the two can't combine into an over-narrow filter.
  const handleDistrictChange = (value) => {
    setDistrict(value);

    if (value.trim().length > 0) {
      setCity("");
      setSuggestions([]);
      setUserCoords(null);
    }
  };

  const handleSelectLocation = (place) => {

    const selectedCity = place.text;

    // Mapbox returns [lng, lat] in `center` for every place —
    // the same response already powering the autocomplete
    // suggestions, just previously unused beyond the text label.

    const [placeLng, placeLat] = place.center;

    setCity(selectedCity);

    setSuggestions([]);

    setCurrentPage(1);

    setUserCoords({ lat: placeLat, lng: placeLng });

    // Picking a city/place is the other search mode — clear any
    // leftover District text so it can't combine with this city +
    // GPS-radius search (same reason handleDistrictChange clears
    // city/coords in the other direction).
    setDistrict("");

    // The effect below re-fetches automatically once userCoords
    // changes, but city/search changed in the same tick too, so
    // fire immediately with the fresh values rather than waiting.

    dispatch(
      searchHospitals({
        city: selectedCity,
        search,
        rating,
        emergency,
        icu,
        acceptingPatients,
        distance, // ⭐ Include distance when we have coordinates
        lat: placeLat,
        lng: placeLng,
      })
    );

  };

  // =====================================
  // SEARCH FILTER
  // =====================================

  const handleSearch = () => {

    setCurrentPage(1);

    // District search should not use geo coordinates
  if (district) {
    dispatch(
      searchHospitals({
        search,
        city,
        district,
        rating,
        emergency,
        icu,
        acceptingPatients,
      })
    );

    return;
  }


    fetchHospitals()


  };

  // =====================================
  // LOCATION BASED SEARCH
  // =====================================

  const findNearMe = () => {
    if (!navigator.geolocation) {
      alert("Location not supported");

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setCurrentPage(1);

        setCity("");

        // Same mutual-exclusivity rule as the other search modes —
        // "near me" shouldn't combine with a leftover district text.
        setDistrict("");

        setUserCoords({ lat: latitude, lng: longitude });

        // Combine with whatever filters (rating, emergency,
        // icu, distance radius, etc.) are already active,
        // rather than the previous behaviour of ignoring them.

        dispatch(
          searchHospitals({
            search,
            rating,
            emergency,
            icu,
            acceptingPatients,
            distance, // ⭐ Include current distance filter
            lat: latitude,
            lng: longitude,
          }),
        );
      },

      () => {
        alert("Please allow location access");
      },
    );
  };

  // =====================================
  // SORT (client-side, applied to whatever result set we have)
  // =====================================

  const sortedHospitals = useMemo(() => {
    const list = [...hospitals];

    switch (sortBy) {
      case "rating":
        return list.sort(
          (a, b) => (b.rating?.average || 0) - (a.rating?.average || 0)
        );
      case "distance":
        return list.sort(
          (a, b) =>
            (a.distanceInKm ?? Infinity) - (b.distanceInKm ?? Infinity)
        );
      case "name":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return list;
    }
  }, [hospitals, sortBy]);

  // =====================================
  // PAGINATION
  // =====================================

  const totalPages = Math.ceil(
    sortedHospitals.length / ITEMS_PER_PAGE
  );

  const currentHospitals = sortedHospitals.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // =====================================
  // DISTRICT SEARCH — GROUP RESULTS BY CITY
  // A district spans multiple cities, so instead of one flat
  // paginated list we show every city that has a match, each
  // with its own hospitals underneath. Backend already sorts
  // district results by city, so this just buckets them.
  // =====================================

  const isDistrictSearch = district.trim().length > 0;

  const hospitalsByCity = isDistrictSearch
    ? sortedHospitals.reduce((groups, hospital) => {
        const cityName = hospital.address?.city || "Other";

        if (!groups[cityName]) {
          groups[cityName] = [];
        }

        groups[cityName].push(hospital);

        return groups;
      }, {})
    : {};

  if (isError) {

    return (
      <div className="pt-32 text-center text-xl text-red-500">
        {message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-50">

      {/* FILTER AREA */}

      <HospitalSearch
        search={search}
        setSearch={setSearch}
        city={city}
        setCity={setCity}
        district={district}
        setDistrict={handleDistrictChange}
        suggestions={suggestions}
        searchLoading={searchLoading}
        handleSelectLocation={handleSelectLocation}
        handleSearch={handleSearch}
        findNearMe={findNearMe}
      />

      {userCoords && (
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <button
            onClick={() => {
              setUserCoords(null);
              setDistance(25); // ⭐ Reset to default when clearing location
              setCurrentPage(1);
              dispatch(
                searchHospitals({
                  search,
                  city,
                  district,
                  rating,
                  emergency,
                  icu,
                  acceptingPatients,
                }),
              );
            }}
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-medium text-brand-800 transition hover:bg-brand-100"
          >
            📍 Showing results within {distance} km ✕ Clear
          </button>
        </div>
      )}

      {/* LOADING */}

      {isLoading && (
        <p className="mt-20 text-center text-xl text-ink-500">
          Loading Hospitals...
        </p>
      )}

      {/* LIST */}

      <section className="px-6 py-12 lg:px-8">

        {hospitals.length === 0 && !isLoading && (
          <h2 className="text-center text-2xl font-bold text-ink-900">
            No hospitals found
          </h2>
        )}

        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[300px_1fr]">

          {/* Left Sidebar */}
          <div className="h-fit lg:sticky lg:top-28">

            <HospitalFilters
              rating={rating}
              setRating={setRating}
              distance={distance}
              setDistance={setDistance}
              emergency={emergency}
              setEmergency={setEmergency}
              icu={icu}
              setIcu={setIcu}
              acceptingPatients={acceptingPatients}
              setAcceptingPatients={setAcceptingPatients}
              userCoords={userCoords}
            />

          </div>

          {/* Right Side */}

          <div>

            {hospitals.length > 0 && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <p className="text-ink-600">
                  Showing{" "}
                  <span className="font-semibold text-ink-900">
                    {hospitals.length}
                  </span>{" "}
                  premium {hospitals.length === 1 ? "facility" : "facilities"}
                </p>

                {!isDistrictSearch && (
                  <HospitalSort value={sortBy} onChange={setSortBy} />
                )}
              </div>
            )}

            {isDistrictSearch ? (

              // ⭐ DISTRICT VIEW — grouped by city, no pagination:
              // the point of a district search is to see every
              // city's hospitals at a glance.

              <div className="space-y-12">
                {Object.entries(hospitalsByCity).map(([cityName, cityHospitals]) => (
                  <div key={cityName}>

                    <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-ink-900">
                      {cityName}

                      <span className="text-sm font-normal text-ink-500">
                        ({cityHospitals.length} {cityHospitals.length === 1 ? "hospital" : "hospitals"})
                      </span>
                    </h3>

                    <div className="grid gap-6 md:grid-cols-2">
                      {cityHospitals.map((hospital) => (
                        <HospitalCard
                          key={hospital._id}
                          hospital={hospital}
                          distance={
                            hospital.distanceInKm !== undefined
                              ? `${hospital.distanceInKm} km away`
                              : undefined
                          }
                        />
                      ))}
                    </div>

                  </div>
                ))}
              </div>

            ) : (

              <div className="grid gap-6 md:grid-cols-2">
                {currentHospitals.map((hospital) => (
                  <HospitalCard
                    key={hospital._id}
                    hospital={hospital}
                    distance={
                      hospital.distanceInKm !== undefined
                        ? `${hospital.distanceInKm} km away`
                        : undefined
                    }
                  />
                ))}
              </div>

            )}

            {!isDistrictSearch && totalPages > 1 && (

              <div className="mt-12 flex justify-center">

                <div className="flex items-center gap-3">

                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-200 bg-white text-lg text-ink-600 transition hover:bg-ink-100 disabled:opacity-40"
                  >
                    ‹
                  </button>

                  {Array.from({ length: totalPages }).map((_, index) => {

                    const page = index + 1;

                    return (

                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`flex h-11 w-11 items-center justify-center rounded-full border font-semibold transition ${
                          currentPage === page
                            ? "border-brand-800 bg-brand-800 text-white"
                            : "border-ink-200 bg-white text-ink-700 hover:bg-ink-100"
                        }`}
                      >

                        {page}

                      </button>

                    );

                  })}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-200 bg-white text-lg text-ink-600 transition hover:bg-ink-100 disabled:opacity-40"
                  >
                    ›
                  </button>

                </div>

              </div>

            )}

          </div>

        </div>
      </section>
    </div>
  );
};

export default Hospitals;