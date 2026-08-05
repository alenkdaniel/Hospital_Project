import { useEffect, useState } from "react";

import axios from "axios";

import { useDispatch, useSelector } from "react-redux";

import {
    MapPin,
    Search,
    Navigation,
    Loader2,
    X,
} from "lucide-react";

import {
    getNearbyHospitals,
    resetHospital,
} from "../../features/hospital/hospitalSlice";

import HospitalCard from "../../components/hospital/HospitalCard";

// =====================================
// NEARBY HOSPITALS
//
// Lets the user pick a point (search a place,
// or use their current GPS position) and shows
// the hospitals that are ALREADY stored in the
// database — i.e. the ones a hospital admin has
// added and a super admin has approved — sorted
// by distance from that point.
//
// This reuses the existing /api/hospitals/nearby
// endpoint (backend $geoNear on the 2dsphere
// `location` index), so no new backend work is
// needed — it purely queries hospitals that were
// already added with coordinates.
// =====================================

const RADIUS_OPTIONS = [5, 10, 25, 50, 100];

const NearbyHospitals = () => {
    const dispatch = useDispatch();

    const { hospitals, isLoading, isError, message } = useSelector(
        (state) => state.hospital,
    );

    const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    const [query, setQuery] = useState("");

    const [suggestions, setSuggestions] = useState([]);

    const [searchLoading, setSearchLoading] = useState(false);

    const [selectedPlace, setSelectedPlace] = useState("");

    const [coords, setCoords] = useState(null); // { lat, lng }

    const [radiusKm, setRadiusKm] = useState(25);

    const [locatingMe, setLocatingMe] = useState(false);

    // =====================================
    // MAPBOX PLACE AUTOCOMPLETE
    // =====================================

    useEffect(() => {
        if (query.trim().length < 3) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                setSearchLoading(true);

                const response = await axios.get(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                        query,
                    )}.json`,
                    {
                        params: {
                            access_token: MAPBOX_TOKEN,
                            autocomplete: true,
                            limit: 5,
                            country: "IN",
                        },
                    },
                );

                setSuggestions(response.data.features);
            } catch (error) {
                console.log(error);
            } finally {
                setSearchLoading(false);
            }
        }, 350);

        return () => clearTimeout(timer);
    }, [query, MAPBOX_TOKEN]);

    // =====================================
    // FETCH NEARBY HOSPITALS
    // Backend expects distance in METERS.
    // =====================================

    const fetchNearby = (lat, lng, radiusInKm) => {
        dispatch(
            getNearbyHospitals({
                lat,
                lng,
                distance: radiusInKm * 1000,
            }),
        );
    };

    // =====================================
    // SELECT A PLACE FROM SUGGESTIONS
    // =====================================

    const handleSelectPlace = (place) => {
        const [lng, lat] = place.center;

        setSelectedPlace(place.place_name);

        setQuery(place.place_name);

        setSuggestions([]);

        setCoords({ lat, lng });

        fetchNearby(lat, lng, radiusKm);
    };

    // =====================================
    // USE MY CURRENT LOCATION
    // =====================================

    const useMyLocation = () => {
        if (!navigator.geolocation) {
            alert("Location is not supported on this device");
            return;
        }

        setLocatingMe(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                setCoords({ lat: latitude, lng: longitude });

                setSelectedPlace("Your current location");

                setQuery("");

                setLocatingMe(false);

                fetchNearby(latitude, longitude, radiusKm);
            },
            () => {
                setLocatingMe(false);

                alert("Please allow location access to find hospitals near you");
            },
        );
    };

    // =====================================
    // RADIUS CHANGE — refetch with same point
    // =====================================

    const handleRadiusChange = (km) => {
        setRadiusKm(km);

        if (coords) {
            fetchNearby(coords.lat, coords.lng, km);
        }
    };

    const clearLocation = () => {
        setCoords(null);

        setSelectedPlace("");

        setQuery("");

        dispatch(resetHospital());
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* HEADER / LOCATION PICKER */}

            <section className="bg-white border-b">
                <div className="max-w-5xl mx-auto px-6 lg:px-8 py-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                        Nearby Hospitals
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Pick a location and we&apos;ll show the approved hospitals
                        closest to it, nearest first.
                    </p>

                    <div className="mt-8 grid gap-4 md:grid-cols-[1fr_auto]">
                        {/* SEARCH BOX */}

                        <div className="relative">
                            <Search
                                size={20}
                                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search an address, area, or landmark..."
                                className="w-full rounded-2xl border border-gray-300 bg-white py-4 pl-14 pr-12 outline-none transition focus:border-blue-600"
                            />

                            {searchLoading && (
                                <Loader2
                                    size={18}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 animate-spin text-gray-400"
                                />
                            )}

                            {suggestions.length > 0 && (
                                <div className="absolute z-20 mt-2 w-full max-h-64 overflow-y-auto rounded-xl border bg-white shadow-lg">
                                    {suggestions.map((place) => (
                                        <div
                                            key={place.id}
                                            onClick={() => handleSelectPlace(place)}
                                            className="cursor-pointer border-b p-3 last:border-b-0 hover:bg-blue-50"
                                        >
                                            {place.place_name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* USE MY LOCATION */}

                        <button
                            type="button"
                            onClick={useMyLocation}
                            disabled={locatingMe}
                            className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                        >
                            <Navigation size={18} />
                            {locatingMe ? "Locating..." : "Use My Location"}
                        </button>
                    </div>

                    {/* SELECTED LOCATION + RADIUS */}

                    {coords && (
                        <div className="mt-6 flex flex-wrap items-center gap-4">
                            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                                <MapPin size={16} />
                                {selectedPlace || "Selected location"}
                                <button
                                    onClick={clearLocation}
                                    className="ml-1 rounded-full p-0.5 hover:bg-blue-100"
                                    aria-label="Clear location"
                                >
                                    <X size={14} />
                                </button>
                            </span>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Within</span>

                                {RADIUS_OPTIONS.map((km) => (
                                    <button
                                        key={km}
                                        onClick={() => handleRadiusChange(km)}
                                        className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${radiusKm === km
                                                ? "border-blue-600 bg-blue-600 text-white"
                                                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                                            }`}
                                    >
                                        {km} km
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* RESULTS */}

            <section className="px-6 lg:px-8 py-12">
                <div className="max-w-5xl mx-auto space-y-8">
                    {!coords && (
                        <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white py-20 text-center">
                            <MapPin size={40} className="mx-auto text-gray-300" />

                            <h2 className="mt-4 text-xl font-semibold text-slate-900">
                                Search a location to get started
                            </h2>

                            <p className="mt-2 text-gray-500">
                                Or tap &quot;Use My Location&quot; to find hospitals near you.
                            </p>
                        </div>
                    )}

                    {isLoading && coords && (
                        <p className="text-center text-xl text-gray-600">
                            Finding hospitals near you...
                        </p>
                    )}

                    {isError && (
                        <p className="text-center text-red-500">{message}</p>
                    )}

                    {coords && !isLoading && !isError && hospitals.length === 0 && (
                        <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white py-20 text-center">
                            <h2 className="text-xl font-semibold text-slate-900">
                                No approved hospitals within {radiusKm} km
                            </h2>

                            <p className="mt-2 text-gray-500">
                                Try a larger radius or a different location.
                            </p>
                        </div>
                    )}

                    {coords &&
                        !isLoading &&
                        hospitals.map((hospital) => (
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
            </section>
        </div>
    );
};

export default NearbyHospitals;