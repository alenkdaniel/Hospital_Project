import { Link, useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { login, reset } from "../../redux/slices/authSlice";

import toast from "react-hot-toast";

import GoogleLoginButton from "../../components/GoogleLoginButton";

function Login() {
  const [formData, setFormData] = useState({
    email: "",

    password: "",
  });

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const {
    user,

    isLoading,

    isSuccess,

    isError,

    message,
  } = useSelector((state) => state.auth);

  // =====================================
  // HANDLE CHANGE
  // =====================================

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  // =====================================
  // LOGIN SUBMIT
  // =====================================

  const handleLogin = (e) => {
    e.preventDefault();


    dispatch(login(formData))
      .then((result) => {

        console.log(
          "REDUX RESULT:",
          result
        );

      });
  };

  // =====================================
  // AFTER LOGIN
  // =====================================

  useEffect(() => {


    if (isError) {

      toast.error(message);

      dispatch(reset());

    }


    if (isSuccess && user) {


      toast.success("Login successful");


      if (user.role === "super_admin") {

        navigate("/super-admin");

      }
      else if (user.role === "hospital_admin") {

        navigate("/hospital-admin");

      }
      else {

        navigate("/dashboard");

      }


      dispatch(reset());

    }


  }, [user, isSuccess, isError, message, navigate, dispatch]);

  return (
    <div
      className="
min-h-screen
pt-20
bg-blue-50
flex
items-center
justify-center
px-6
"
    >
      <div
        className="
w-full
max-w-6xl
grid
md:grid-cols-2
bg-white
rounded-3xl
shadow-xl
overflow-hidden
"
      >
        {/* LEFT SIDE */}

        <div
          className="
p-10
bg-blue-50
"
        >
          <img
            src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1200"
            alt="healthcare"
            className="
w-full
h-64
object-cover
rounded-2xl
shadow-lg
"
          />

          <h1
            className="
mt-10
text-5xl
font-bold
tracking-widest
text-gray-800
"
          >
            WELCOME
            <br />
            BACK
          </h1>

          <p
            className="
mt-6
text-gray-600
text-lg
leading-relaxed
"
          >
            Login to manage appointments, find hospitals and access healthcare
            services securely.
          </p>
        </div>

        {/* RIGHT SIDE */}

        <div
          className="
flex
items-center
justify-center
p-12
"
        >
          <div
            className="
w-full
max-w-md
"
          >
            <h2
              className="
text-3xl
font-bold
text-gray-900
"
            >
              Login Account
            </h2>

            <p
              className="
text-gray-500
mt-2
"
            >
              Continue your healthcare journey
            </p>

            <form
              onSubmit={handleLogin}
              className="
mt-8
space-y-5
"
            >
              <input
                name="email"
                value={formData.email}
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
                value={formData.password}
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
                type="submit"
                className="
w-full
bg-blue-600
text-white
py-4
rounded-xl
font-semibold
hover:bg-blue-700
transition
"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Forgot Password?
              </Link>
            </form>

            {/* DIVIDER */}

            <div
              className="
flex
items-center
gap-3
my-6
"
            >
              <div
                className="
flex-1
h-px
bg-gray-300
"
              />

              <span
                className="
text-gray-400
text-sm
"
              >
                OR
              </span>

              <div
                className="
flex-1
h-px
bg-gray-300
"
              />
            </div>

            <div
              className="
flex
justify-center
"
            >
              {/* <GoogleLoginButton /> */}
            </div>

            <p
              className="
text-center
mt-8
text-gray-500
"
            >
              Don't have an account?
              <Link
                to="/register"
                className="
text-blue-600
ml-2
font-semibold
"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
