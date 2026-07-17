import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { updateProfile, reset } from "../../redux/slices/authSlice";

import ImageUpload from "../../components/ImageUpload";

import toast from "react-hot-toast";

import { motion } from "framer-motion";

const Profile = () => {
  const dispatch = useDispatch();

  const {
    user,

    isLoading,

    isSuccess,

    isError,

    message,
  } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: user?.name || "",

    email: user?.email || "",

    phone: user?.phone || "",
  });

  const [profileImage, setProfileImage] = useState(null);

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
  // UPDATE PROFILE
  // ===============================

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append(
      "name",

      form.name,
    );

    formData.append(
      "phone",

      form.phone,
    );

    if (profileImage) {
      formData.append(
        "profileImage",

        profileImage,
      );
    }

    dispatch(updateProfile(formData));
  };

  // ===============================
  // RESPONSE
  // ===============================

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      toast.success("Profile updated");
    }

    return () => {
      dispatch(reset());
    };
  }, [isSuccess, isError, message, dispatch]);

  return (
    <div
      className="
min-h-screen
pt-28
bg-gray-50
px-6
flex
justify-center
"
    >
      <motion.form
        initial={{
          opacity: 0,

          y: 40,
        }}
        animate={{
          opacity: 1,

          y: 0,
        }}
        onSubmit={submitHandler}
        className="
bg-white
shadow-2xl
rounded-[35px]
p-10
w-full
max-w-5xl
"
      >
        {/* HEADER */}

        <div
          className="
flex
items-center
gap-8
border-b
pb-8
"
        >
          <img
            src={
              user?.profileImage?.url ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            className="
w-32
h-32
rounded-full
object-cover
shadow-lg
"
          />

          <div>
            <h1
              className="
text-4xl
font-bold
"
            >
              {user?.name}
            </h1>

            <p
              className="
text-gray-500
mt-2
capitalize
"
            >
              {user?.role}
            </p>
          </div>
        </div>

        {/* FORM */}

        <div
          className="
mt-10
space-y-5
"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="
w-full
bg-gray-100
p-4
rounded-xl
outline-none
"
          />

          <input
            value={form.email}
            disabled
            className="
w-full
bg-gray-200
p-4
rounded-xl
text-gray-500
"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="
w-full
bg-gray-100
p-4
rounded-xl
outline-none
"
          />

          <ImageUpload
            label="Profile Image"
            multiple={false}
            maxFiles={1}
            onChange={setProfileImage}
          />

          {/* ROLE INFORMATION */}

          <div
            className="
bg-blue-50
rounded-2xl
p-6
"
          >
            <h2
              className="
font-bold
text-xl
mb-3
"
            >
              Account Information
            </h2>

            <p>Role : {user?.role}</p>

            <p>Email Verified :{user?.isVerified ? " Yes" : " No"}</p>
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
            {isLoading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default Profile;
