import axios from "axios";

import { useEffect, useState, useRef } from "react";

// import { Link } from "react-router-dom";

// import { motion } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";

import {
  getHospitals,
  searchHospitals,
  getNearbyHospitals,
  resetHospital,
} from "../../features/hospital/hospitalSlice";

import HospitalSearch from "../../components/hospital/HospitalSearch";

import HospitalFilters from "../../components/hospital/HospitalFilters";

import HospitalCard from "../../components/hospital/HospitalCard";

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

  const [suggestions, setSuggestions] = useState([]);

  const [searchLoading, setSearchLoading] = useState(false);

  const [rating, setRating] = useState(0);

  const [distance, setDistance] = useState(25);

  const [emergency, setEmergency] = useState(false);

  const [icu, setIcu] = useState(false);

  const [acceptingPatients, setAcceptingPatients] = useState(false);

  const ITEMS_PER_PAGE = 5;

  const [currentPage, setCurrentPage] = useState(1);

  const isFirstRender = useRef(true);

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
  // AUTO FILTER
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
    distance,
  ]);

  // const getContextValue = (place, type) => {
  //   return (
  //     place.context?.find((item) => item.id.startsWith(type))?.text || ""
  //   );
  // };

  // =====================================
  // COMMON SEARCH
  // =====================================

  const fetchHospitals = () => {
    dispatch(
      searchHospitals({
        search,
        city,
        rating,
        emergency,
        icu,
        acceptingPatients,
        distance,
      })
    );
  };

  const handleSelectLocation = (place) => {

    const selectedCity = place.text;

    setCity(selectedCity);

    setSuggestions([]);

    setCurrentPage(1);

    dispatch(
      searchHospitals({
        city: selectedCity,
        search,
        rating,
      })
    );

  };

  // =====================================
  // SEARCH FILTER
  // =====================================

  const handleSearch = () => {

    setCurrentPage(1);

    fetchHospitals()

    // dispatch(
    //   searchHospitals({
    //     search,
    //     city,
    //     rating,
    //     emergency,
    //     icu,
    //     acceptingPatients,
    //     distance,
    //   })
    // );

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
        setCurrentPage(1);
        dispatch(
          getNearbyHospitals({
            lat: position.coords.latitude,

            lng: position.coords.longitude,

            distance: 10000,
          }),
        );
      },

      () => {
        alert("Please allow location access");
      },
    );
  };

  // =====================================
  // PAGINATION
  // =====================================

  const totalPages = Math.ceil(
    hospitals.length / ITEMS_PER_PAGE
  );

  const currentHospitals = hospitals.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isError) {

    return (
      <div
        className="
pt-32
text-center
text-red-500
text-xl
"
      >
        {message}
      </div>
    );
  }

  return (
    <div
      className="
min-h-screen
bg-gray-50
"
    >

      {/* FILTER AREA */}

      <HospitalSearch
        search={search}
        setSearch={setSearch}
        city={city}
        setCity={setCity}
        suggestions={suggestions}
        searchLoading={searchLoading}
        handleSelectLocation={handleSelectLocation}
        handleSearch={handleSearch}
        findNearMe={findNearMe}
      />

      {/* LOADING */}

      {isLoading && (
        <p
          className="
text-center
mt-20
text-xl
"
        >
          Loading Hospitals...
        </p>
      )}

      {/* LIST */}

      <section
        className="
px-10
md:px-24
py-20
"
      >
        {hospitals.length === 0 && !isLoading && (
          <h2
            className="
text-center
text-2xl
font-bold
"
          >
            No hospitals found
          </h2>
        )}

        {/* <div className="grid lg:grid-cols-[320px_1fr] gap-8"> */}
        <div className="max-w-7xl mx-auto">

          {/* Left Sidebar */}
          {/* <div className="sticky top-28 h-fit">

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
            />

          </div> */}

          {/* Right Side */}

          <div>


            <div className="space-y-8">

              {currentHospitals.map((hospital) => (
                <HospitalCard
                  key={hospital._id}
                  hospital={hospital}
                />
              ))}

            </div>

            {totalPages > 1 && (

              <div className="mt-12 flex justify-center">

                <div className="flex items-center gap-3">

                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="
h-12
w-12
rounded-full
border
text-xl
transition
hover:bg-gray-100
disabled:opacity-40
"
                  >
                    ‹
                  </button>

                  {Array.from({ length: totalPages }).map((_, index) => {

                    const page = index + 1;

                    return (

                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`
h-12
w-12
rounded-full
border
font-semibold
transition

${currentPage === page
                            ?
                            "bg-blue-600 border-blue-600 text-white"
                            :
                            "bg-white hover:bg-gray-100"
                          }
`}
                      >

                        {page}

                      </button>

                    );

                  })}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="
h-12
w-12
rounded-full
border
text-xl
transition
hover:bg-gray-100
disabled:opacity-40
"
                  >
                    ,
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
