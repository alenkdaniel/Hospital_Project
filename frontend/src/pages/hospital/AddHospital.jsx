import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import {
  createHospital,
  resetHospital,
} from "../../features/hospital/hospitalSlice";

import ImageUpload from "../../components/ImageUpload";

import toast from "react-hot-toast";

import axios from "axios";

// ===============================
// STATIC OPTIONS
//
// Kept in this file (rather than a
// shared constants file) so the change
// stays scoped — feel free to move
// these to /constants if other forms
// need them later.
// ===============================

const HOSPITAL_TYPES = [
  "Government",
  "Private",
  "Clinic",
  "Multi-Speciality",
];

// Same department names used by AddDoctor's
// BasicInformationCard, plus a few extra
// commonly-needed ones, so hospital-level
// department filtering stays consistent with
// what doctors are actually tagged with.
const DEPARTMENT_OPTIONS = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Physician",
  "Dermatology",
  "ENT",
  "Gynecology",
  "General Surgery",
  "Oncology",
  "Urology",
  "Psychiatry",
  "Ophthalmology",
  "Nephrology",
  "Radiology",
];

const FACILITY_OPTIONS = [
  "ICU",
  "Emergency Ward",
  "Blood Bank",
  "Pharmacy",
  "Ambulance",
  "Laboratory",
  "X-Ray",
  "MRI",
  "CT Scan",
  "Dialysis",
  "Operation Theatre",
  "Parking",
  "Cafeteria",
  "Wifi",
];


const AddHospital = () => {
  
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const {
    isLoading,

    isSuccess,

    isError,

    message,
  } = useSelector((state) => state.hospital);

  const [form, setForm] = useState({
    name: "",

    description: "",

    email: "",

    phone: "",

    website: "",

    street: "",

    city: "",

    district: "",

    state: "",

    pincode: "",

    hospitalType: "Private",

    registrationNumber: "",

    licenseNumber: "",
  });

  // ===============================
  // NEW: FACILITIES / DEPARTMENTS
  // (multi-select arrays)
  // ===============================

  const [facilities, setFacilities] = useState([]);

  const [departments, setDepartments] = useState([]);

  // ===============================
  // NEW: EMERGENCY / BEDS / HOURS
  // ===============================

  const [emergency, setEmergency] = useState({
    available: true,
    ambulance: true,
  });

  const [beds, setBeds] = useState({
    total: "",
    available: "",
  });

  const [open24Hours, setOpen24Hours] = useState(true);

  const [images, setImages] = useState([]);

  const [certificate, setCertificate] = useState(null);

  const [location, setLocation] = useState({
    lat: 0,

    lng: 0,
  });

  const [searchLocation, setSearchLocation] = useState("");

  const [suggestions, setSuggestions] = useState([]);

  const [searchLoading, setSearchLoading] = useState(false);

  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  useEffect(() => {
    if (searchLocation.trim().length < 3) {
      setSuggestions([])
      return
    };
    const searchPlaces = async () => {
      try {
        setSearchLoading(true)
        const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchLocation
        )}.json`, {
          params: {
            access_token: MAPBOX_TOKEN,
            autocomplete: true,
            limit: 5,
            country: "IN",
          },
        })
        console.log(response.data);
        setSuggestions(response.data.features);
      } catch (error) {
        console.log(error);
      } finally {
        setSearchLoading(false);
      }
    }
    searchPlaces();
  }, [searchLocation])

  const getContextValue = (place, type) => {
  return (
    place.context?.find((item) => item.id.startsWith(type))?.text || ""
  );
};

  const handleSelectLocation = (place) => {

  setSearchLocation(place.place_name);

  setSuggestions([]);
    setLocation({
    lng: place.center[0],
    lat: place.center[1],
  });
  setForm((prev) => ({
    ...prev,

    city: getContextValue(place, "place"),

    // ⭐ Mapbox returns the enclosing district/county under the
    // "district" context id for Indian addresses (falls back to
    // empty so the admin can still type it manually below).

    district: getContextValue(place, "district"),

    state: getContextValue(place, "region"),

    pincode: getContextValue(place, "postcode"),
  }));

};

  // ===============================
  // INPUT CHANGE
  // ===============================

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  // ===============================
  // TOGGLE HELPERS (facilities / departments)
  // ===============================

  const toggleFacility = (item) => {
    setFacilities((prev) =>
      prev.includes(item)
        ? prev.filter((f) => f !== item)
        : [...prev, item],
    );
  };

  const toggleDepartment = (item) => {
    setDepartments((prev) =>
      prev.includes(item)
        ? prev.filter((d) => d !== item)
        : [...prev, item],
    );
  };

  // ===============================
  // GET LOCATION
  // ===============================

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,

          lng: position.coords.longitude,
        });

        toast.success("Location added");
      },

      () => {
        toast.error("Location permission denied");
      },
    );
  };

  // ===============================
  // SUBMIT
  // ===============================

  const submitHandler = (e) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Upload hospital images");

      return;
    }

    if (!form.registrationNumber.trim() || !form.licenseNumber.trim()) {
      toast.error("Registration number and license number are required");

      return;
    }

    if (departments.length === 0) {
      toast.error("Select at least one department");

      return;
    }

    const formData = new FormData();

    // BASIC

    formData.append("name", form.name);

    formData.append("description", form.description);

    formData.append("hospitalType", form.hospitalType);

    // CONTACT

    formData.append("contact[email]", form.email);

    formData.append("contact[phone]", form.phone);

    formData.append("contact[website]", form.website);

    // ADDRESS

    formData.append("address[street]", form.street);

    formData.append("address[city]", form.city);

    formData.append("address[district]", form.district);

    formData.append("address[state]", form.state);

    formData.append("address[pincode]", form.pincode);

    // LOCATION
    // MongoDB order: longitude latitude

    formData.append(
      "location[type]",

      "Point",
    );

    formData.append(
      "location[coordinates][0]",

      location.lng,
    );

    formData.append(
      "location[coordinates][1]",

      location.lat,
    );

    // FACILITIES / DEPARTMENTS
    // Appended as repeated keys — multer/append-field
    // collects repeated same-name fields into an array,
    // same way "images" already works below.

    facilities.forEach((item) => {
      formData.append("facilities", item);
    });

    departments.forEach((item) => {
      formData.append("departments", item);
    });

    // EMERGENCY

    formData.append("emergency[available]", emergency.available);

    formData.append("emergency[ambulance]", emergency.ambulance);

    // BEDS

    formData.append("beds[total]", beds.total || 0);

    formData.append("beds[available]", beds.available || 0);

    // HOURS

    formData.append("open24Hours", open24Hours);

    // VERIFICATION DOCUMENTS
    // (read directly on req.body by the controller —
    // NOT nested under "verification" so the backend's
    // own verification object always wins)

    formData.append("registrationNumber", form.registrationNumber);

    formData.append("licenseNumber", form.licenseNumber);

    // NOTE: rating is intentionally never sent from this form.
    // Hospital admins can't set their own rating — it's
    // computed only from patient reviews (see reviewController).

    // IMAGES

    images.forEach((image) => {
      formData.append(
        "images",

        image,
      );
    });

    // CERTIFICATE

    if (certificate) {
      formData.append(
        "certificate",

        certificate,
      );
    }

    dispatch(createHospital(formData))
      .then((result) => {

        console.log(
          "CREATE HOSPITAL RESULT:",
          result
        );

      });
  };

  // ===============================
  // REDIRECT
  // ===============================

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      toast.success("Hospital submitted for approval");

      navigate("/hospital-admin");
    }

    return () => {
      dispatch(resetHospital());
    };
  }, [isSuccess, isError, message, navigate, dispatch]);

  return (
    <div
      className="
min-h-screen
pt-28
bg-gray-50
flex
justify-center
px-6
pb-16
"
    >
      <form
        onSubmit={submitHandler}
        className="
bg-white
shadow-2xl
rounded-[35px]
p-10
w-full
max-w-5xl
space-y-5
"
      >
        <h1
          className="
text-4xl
font-bold
mb-8
"
        >
          🏥 Setup Hospital Profile
        </h1>

        {/* SEARCH HOSPITAL LOCATION */}

        <div className="mb-5">
          <label className="block mb-2 font-semibold">
            📍 Use Current Location
          </label>

          <input
            type="text"
            placeholder="Search hospital address..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="
      w-full
      bg-gray-100
      p-4
      rounded-xl
      outline-none
    "
          />
          {suggestions.length > 0 && (

            <div className="bg-white border rounded-xl shadow-lg mt-2 max-h-64 overflow-y-auto">

              {suggestions.map((place) => (

                <div
                  key={place.id}
                  onClick={() => handleSelectLocation(place)}
                  className="p-3 hover:bg-blue-50 cursor-pointer border-b"
                >
                  {place.place_name}
                </div>

              ))}

            </div>

          )}

        </div>

        {[
          ["name", "Hospital Name"],

          ["description", "Description"],

          ["email", "Email"],

          ["phone", "Phone"],

          ["website", "Website (optional)"],

          ["street", "Street"],

          ["city", "City"],

          ["district", "District"],

          ["state", "State"],

          ["pincode", "Pincode"],
        ].map((item) => (
          <input
            key={item[0]}
            name={item[0]}
            value={form[item[0]]}
            placeholder={item[1]}
            onChange={handleChange}
            className="
w-full
bg-gray-100
p-4
rounded-xl
outline-none
"
          />
        ))}

        {/* HOSPITAL TYPE */}

        <div>
          <label className="block mb-2 font-semibold">
            Hospital Type
          </label>

          <select
            name="hospitalType"
            value={form.hospitalType}
            onChange={handleChange}
            className="
w-full
bg-gray-100
p-4
rounded-xl
outline-none
"
          >
            {HOSPITAL_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* VERIFICATION DOCUMENTS */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input
            name="registrationNumber"
            value={form.registrationNumber}
            placeholder="Registration Number"
            onChange={handleChange}
            className="
w-full
bg-gray-100
p-4
rounded-xl
outline-none
"
          />

          <input
            name="licenseNumber"
            value={form.licenseNumber}
            placeholder="License Number"
            onChange={handleChange}
            className="
w-full
bg-gray-100
p-4
rounded-xl
outline-none
"
          />
        </div>

        {/* DEPARTMENTS */}

        <div>
          <label className="block mb-2 font-semibold">
            Departments
          </label>

          <div className="flex flex-wrap gap-2">
            {DEPARTMENT_OPTIONS.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => toggleDepartment(item)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                  departments.includes(item)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-100 text-gray-700 border-gray-200"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* FACILITIES */}

        <div>
          <label className="block mb-2 font-semibold">
            Facilities
          </label>

          <div className="flex flex-wrap gap-2">
            {FACILITY_OPTIONS.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => toggleFacility(item)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                  facilities.includes(item)
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-gray-100 text-gray-700 border-gray-200"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* BEDS */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input
            type="number"
            min="0"
            name="totalBeds"
            value={beds.total}
            placeholder="Total Beds"
            onChange={(e) =>
              setBeds((prev) => ({ ...prev, total: e.target.value }))
            }
            className="
w-full
bg-gray-100
p-4
rounded-xl
outline-none
"
          />

          <input
            type="number"
            min="0"
            name="availableBeds"
            value={beds.available}
            placeholder="Available Beds"
            onChange={(e) =>
              setBeds((prev) => ({ ...prev, available: e.target.value }))
            }
            className="
w-full
bg-gray-100
p-4
rounded-xl
outline-none
"
          />
        </div>

        {/* EMERGENCY / HOURS */}

        <div className="flex flex-wrap gap-6 py-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={emergency.available}
              onChange={(e) =>
                setEmergency((prev) => ({
                  ...prev,
                  available: e.target.checked,
                }))
              }
              className="h-5 w-5 accent-blue-600"
            />
            Emergency Available
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={emergency.ambulance}
              onChange={(e) =>
                setEmergency((prev) => ({
                  ...prev,
                  ambulance: e.target.checked,
                }))
              }
              className="h-5 w-5 accent-blue-600"
            />
            Ambulance Service
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={open24Hours}
              onChange={(e) => setOpen24Hours(e.target.checked)}
              className="h-5 w-5 accent-blue-600"
            />
            Open 24 Hours
          </label>
        </div>

        {/* LOCATION */}

        <button
          type="button"
          onClick={getLocation}
          className="
w-full
bg-green-600
text-white
py-4
rounded-xl
font-bold
"
        >
          Search Hospital Location
        </button>

        {/* IMAGE UPLOAD */}

        <ImageUpload
          label="Hospital Images"
          multiple={true}
          maxFiles={5}
          onChange={setImages}
        />

        {/* CERTIFICATE */}

        <div>
          <label
            className="
font-semibold
"
          >
            Verification Certificate
          </label>

          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => {

              const file = e.target.files[0];

              console.log(
                "SELECTED CERTIFICATE:",
                file
              );

              setCertificate(file);

            }}

            className="
mt-3
w-full
bg-gray-100
p-4
rounded-xl
"
          />
        </div>

        <button
          disabled={isLoading}
          className="
w-full
bg-blue-600
text-white
py-4
rounded-xl
font-bold
hover:bg-blue-700
"
        >
          {isLoading ? "Creating..." : "Create Hospital"}
        </button>
      </form>
    </div>
  );
};

export default AddHospital;