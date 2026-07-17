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

    street: "",

    city: "",

    state: "",

    pincode: "",
  });

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

    const formData = new FormData();

    // BASIC

    formData.append("name", form.name);

    formData.append("description", form.description);

    // CONTACT

    formData.append("contact[email]", form.email);

    formData.append("contact[phone]", form.phone);

    // ADDRESS

    formData.append("address[street]", form.street);

    formData.append("address[city]", form.city);

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

    // dispatch(createHospital(formData));
    console.log("CREATE HOSPITAL CLICKED");


    for (let data of formData.entries()) {

      console.log(
        data[0],
        data[1]
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

          ["street", "Street"],

          ["city", "City"],

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

          {/* <input
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
          /> */}
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
