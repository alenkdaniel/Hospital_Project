import { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import toast from "react-hot-toast";

import { register, reset } from "../../redux/slices/authSlice";

const HospitalAdminRegister = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth,
  );

  const [form, setForm] = useState({
    name: "",

    email: "",

    password: "",
  });

  // ===============================
  // HANDLE CHANGE
  // ===============================

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  // ===============================
  // REGISTER
  // ===============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill all fields");

      return;
    }

    dispatch(
      register({
        ...form,

        role: "hospital_admin",
      }),
    );
  };

  // ===============================
  // SUCCESS / ERROR
  // ===============================

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess && user) {
      toast.success("Hospital account created");

      navigate("/hospital-admin");
    }

    return () => {
      dispatch(reset());
    };
  }, [isSuccess, isError, message, user, navigate, dispatch]);

  return (
    <div
      className="
min-h-screen
pt-24
bg-blue-50
flex
items-center
justify-center
px-6
"
    >
      <div
        className="
bg-white
shadow-2xl
rounded-[35px]
overflow-hidden
grid
md:grid-cols-2
max-w-6xl
w-full
"
      >
        {/* LEFT */}

        <div
          className="
bg-gradient-to-br
from-blue-600
to-cyan-500
p-12
text-white
"
        >
          <h1
            className="
text-5xl
font-bold
"
          >
            🏥 Hospital
            <br />
            Partner
          </h1>

          <p
            className="
mt-6
text-blue-100
text-lg
"
          >
            Register your hospital and manage doctors, appointments and
            healthcare services.
          </p>
        </div>

        {/* FORM */}

        <div
          className="
p-12
"
        >
          <h2
            className="
text-3xl
font-bold
text-gray-800
"
          >
            Create Hospital Account
          </h2>

          <p
            className="
text-gray-500
mt-2
"
          >
            Join our healthcare network
          </p>

          <form
            onSubmit={handleSubmit}
            className="
mt-8
space-y-5
"
          >
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Hospital Admin Name"
              className="
w-full
bg-gray-100
p-4
rounded-xl
outline-none
"
            />

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="
w-full
bg-gray-100
p-4
rounded-xl
outline-none
"
            />

            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="
w-full
bg-gray-100
p-4
rounded-xl
outline-none
"
            />

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
transition
disabled:bg-gray-400
"
            >
              {isLoading ? "Creating Account..." : "Register Hospital"}
            </button>
          </form>

          <p
            className="
text-center
mt-8
text-gray-500
"
          >
            Already registered?
            <Link
              to="/login"
              className="
ml-2
text-blue-600
font-semibold
"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HospitalAdminRegister;
