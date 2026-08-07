import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import {
  getMyHospital,
  updateHospital,
  resetHospital,
} from "../../features/hospital/hospitalSlice";

import ImageUpload from "../../components/ImageUpload";

import toast from "react-hot-toast";

import axios from "axios";

// ===============================
// STATIC OPTIONS
// Same lists as AddHospital.jsx, kept in
// sync so a hospital edited here still
// shows the same choices it was created
// with.
// ===============================

const HOSPITAL_TYPES = [
  "Government",
  "Private",
  "Clinic",
  "Multi-Speciality",
];

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

// Merge the predefined list with whatever the hospital already
// has saved — so a value saved before (e.g. by an older version
// of this form, or directly via the API) doesn't silently
// disappear from the picker and get dropped on save.

const mergeOptions = (predefined, existing = []) => [
  ...predefined,
  ...existing.filter((item) => !predefined.includes(item)),
];

const EditHospital = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const {
    hospital,
  } = useSelector((state) => state.hospital);

  // Local, page-only loading/saving flags — deliberately NOT the
  // shared isLoading/isSuccess/isError from the hospital slice.
  // Those flags are shared across getMyHospital, createHospital
  // AND updateHospital, so getMyHospital.fulfilled sets the same
  // `isSuccess = true` that updateHospital.fulfilled does. Relying
  // on it here caused simply *opening* this page (which fetches
  // the hospital) to look like a completed save and bounce back
  // to the dashboard. Using dispatch(...).unwrap() below gives
  // each action its own local, unambiguous result instead.

  const [pageLoading, setPageLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [loadedOnce, setLoadedOnce] = useState(false);

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
    country: "India",
    pincode: "",
    hospitalType: "Private",
    registrationNumber: "",
    licenseNumber: "",
  });

  const [isActive, setIsActive] = useState(true);

  const [facilities, setFacilities] = useState([]);

  const [departments, setDepartments] = useState([]);

  const [emergency, setEmergency] = useState({
    available: true,
    ambulance: true,
  });

  const [beds, setBeds] = useState({
    total: "",
    available: "",
  });

  const [open24Hours, setOpen24Hours] = useState(true);

  // New images/certificate the admin chooses to replace the
  // current ones with — optional. If left empty, the existing
  // Cloudinary images/certificate stay untouched.

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

  // ===============================
  // PREFILL FORM FROM A LOADED HOSPITAL
  // Plain function (not an effect) — called once, directly,
  // right after the fetch below resolves.
  // ===============================

  const prefillForm = (h) => {
    setForm({
      name: h.name || "",
      description: h.description || "",
      email: h.contact?.email || "",
      phone: h.contact?.phone || "",
      website: h.contact?.website || "",
      street: h.address?.street || "",
      city: h.address?.city || "",
      district: h.address?.district || "",
      state: h.address?.state || "",
      country: h.address?.country || "India",
      pincode: h.address?.pincode || "",
      hospitalType: h.hospitalType || "Private",
      registrationNumber: h.verification?.documents?.registrationNumber || "",
      licenseNumber: h.verification?.documents?.licenseNumber || "",
    });

    setFacilities(h.facilities || []);

    setDepartments(h.departments || []);

    setEmergency({
      available: h.emergency?.available ?? true,
      ambulance: h.emergency?.ambulance ?? true,
    });

    setBeds({
      total: h.beds?.total ?? "",
      available: h.beds?.available ?? "",
    });

    setOpen24Hours(h.open24Hours ?? true);

    setIsActive(h.isActive ?? true);

    if (h.location?.coordinates?.length === 2) {
      setLocation({
        lng: h.location.coordinates[0],
        lat: h.location.coordinates[1],
      });
    }

    setSearchLocation(
      [h.address?.street, h.address?.city].filter(Boolean).join(", "),
    );

    setLoadedOnce(true);
  };

  // ===============================
  // LOAD EXISTING HOSPITAL
  // ===============================

  useEffect(() => {
    let cancelled = false;

    const loadHospital = async () => {
      try {
        const data = await dispatch(getMyHospital()).unwrap();

        if (cancelled) return;

        prefillForm(data);
      } catch (error) {
        if (cancelled) return;

        if (error === "Hospital not found") {
          toast.error("No hospital found yet — create one first");
          navigate("/hospital/add-hospital");
        } else {
          toast.error(error || "Failed to load hospital");
        }
      } finally {
        if (!cancelled) setPageLoading(false);
      }
    };

    loadHospital();

    return () => {
      cancelled = true;
      dispatch(resetHospital());
    };
  }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  // ===============================
  // MAPBOX PLACE AUTOCOMPLETE
  // (same "nearby" location-search UI
  // used when the hospital was created)
  // ===============================

  useEffect(() => {
    if (searchLocation.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const searchPlaces = async () => {
      try {
        setSearchLoading(true);

        const response = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            searchLocation,
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
    };

    // Don't re-search immediately after we just programmatically
    // filled the box from the loaded hospital's own address.
    if (loadedOnce) {
      searchPlaces();
    }
  }, [searchLocation]); // eslint-disable-line react-hooks/exhaustive-deps

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
      district: getContextValue(place, "district"),
      state: getContextValue(place, "region"),
      pincode: getContextValue(place, "postcode"),
    }));
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

        toast.success("Location updated");
      },
      () => {
        toast.error("Location permission denied");
      },
    );
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

  const toggleFacility = (item) => {
    setFacilities((prev) =>
      prev.includes(item) ? prev.filter((f) => f !== item) : [...prev, item],
    );
  };

  const toggleDepartment = (item) => {
    setDepartments((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item],
    );
  };

  // ===============================
  // SUBMIT
  // ===============================

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!hospital?._id) return;

    if (!form.registrationNumber.trim() || !form.licenseNumber.trim()) {
      toast.error("Registration number and license number are required");
      return;
    }

    if (departments.length === 0) {
      toast.error("Select at least one department");
      return;
    }

    if (!location.lat || !location.lng) {
      toast.error("Set the hospital location");
      return;
    }

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("hospitalType", form.hospitalType);

    formData.append("contact[email]", form.email);
    formData.append("contact[phone]", form.phone);
    formData.append("contact[website]", form.website);

    formData.append("address[street]", form.street);
    formData.append("address[city]", form.city);
    formData.append("address[district]", form.district);
    formData.append("address[state]", form.state);
    formData.append("address[country]", form.country);
    formData.append("address[pincode]", form.pincode);

    // LOCATION — this is the part that lets an admin move their
    // pin without deleting/recreating the whole hospital.
    formData.append("location[type]", "Point");
    formData.append("location[coordinates][0]", location.lng);
    formData.append("location[coordinates][1]", location.lat);

    facilities.forEach((item) => formData.append("facilities", item));
    departments.forEach((item) => formData.append("departments", item));

    formData.append("emergency[available]", emergency.available);
    formData.append("emergency[ambulance]", emergency.ambulance);

    formData.append("beds[total]", beds.total || 0);
    formData.append("beds[available]", beds.available || 0);

    formData.append("open24Hours", open24Hours);

    formData.append("isActive", isActive);

    formData.append("registrationNumber", form.registrationNumber);
    formData.append("licenseNumber", form.licenseNumber);

    // Only attach files if the admin actually picked new ones —
    // omitting them leaves the existing Cloudinary images /
    // certificate exactly as they are.

    images.forEach((image) => formData.append("images", image));

    if (certificate) {
      formData.append("certificate", certificate);
    }

    setSaving(true);

    try {
      await dispatch(
        updateHospital({
          id: hospital._id,
          hospitalData: formData,
        }),
      ).unwrap();

      toast.success("Hospital updated");

      navigate("/hospital-admin");
    } catch (error) {
      toast.error(error || "Failed to update hospital");
    } finally {
      setSaving(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="pt-32 text-center text-2xl font-bold">
        Loading your hospital...
      </div>
    );
  }

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
        <h1 className="text-4xl font-bold mb-2">
          ✏️ Edit Hospital Profile
        </h1>

        <p className="text-gray-500 mb-6">
          Update any detail — including the hospital's location — and save.
          Nothing gets deleted; existing images and documents stay unless
          you choose to replace them below.
        </p>

        {hospital?.verification?.status && (
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium">
            Verification status:
            <span
              className={
                hospital.verification.status === "approved"
                  ? "text-green-600 font-semibold capitalize"
                  : hospital.verification.status === "rejected"
                    ? "text-red-600 font-semibold capitalize"
                    : "text-orange-500 font-semibold capitalize"
              }
            >
              {hospital.verification.status}
            </span>
            <span className="text-gray-400 font-normal">
              (set by the super admin, not editable here)
            </span>
          </div>
        )}

        {/* SEARCH / UPDATE HOSPITAL LOCATION */}

        <div className="mb-5">
          <label className="block mb-2 font-semibold">
            📍 Hospital Location
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

          {location.lat !== 0 && location.lng !== 0 && (
            <p className="mt-2 text-sm text-gray-500">
              Current pin: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
            </p>
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
          ["country", "Country"],
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
          <label className="block mb-2 font-semibold">Hospital Type</label>

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
          <label className="block mb-2 font-semibold">Departments</label>

          <div className="flex flex-wrap gap-2">
            {mergeOptions(DEPARTMENT_OPTIONS, hospital?.departments).map(
              (item) => (
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
              ),
            )}
          </div>
        </div>

        {/* FACILITIES */}

        <div>
          <label className="block mb-2 font-semibold">Facilities</label>

          <div className="flex flex-wrap gap-2">
            {mergeOptions(FACILITY_OPTIONS, hospital?.facilities).map(
              (item) => (
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
              ),
            )}
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

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-5 w-5 accent-blue-600"
            />
            Hospital Active (visible to patients)
          </label>
        </div>

        {/* USE CURRENT GPS LOCATION */}

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
          Use My Current Location
        </button>

        {/* EXISTING IMAGES */}

        {hospital?.images?.length > 0 && (
          <div>
            <label className="block mb-2 font-semibold">
              Current Images
            </label>

            <div className="flex flex-wrap gap-3">
              {hospital.images.map((img) => (
                <img
                  key={img.publicId || img.url}
                  src={img.url}
                  alt="hospital"
                  className="h-24 w-24 rounded-xl object-cover border"
                />
              ))}
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Uploading new images below will replace all of these — leave
              it empty to keep them as they are.
            </p>
          </div>
        )}

        {/* IMAGE UPLOAD (OPTIONAL — REPLACES ALL) */}

        <ImageUpload
          label="Replace Hospital Images (optional)"
          multiple={true}
          maxFiles={5}
          onChange={setImages}
        />

        {/* CERTIFICATE (OPTIONAL — REPLACES CURRENT) */}

        <div>
          <label className="font-semibold">
            Replace Verification Certificate (optional)
          </label>

          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setCertificate(e.target.files[0])}
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
          disabled={saving}
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
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditHospital;