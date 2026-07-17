import { Link, useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { register, reset } from "../../redux/slices/authSlice";

import toast from "react-hot-toast";

import GoogleLoginButton from "../../components/GoogleLoginButton";

function Register() {
  const [formData, setFormData] = useState({
    name: "",

    email: "",

    password: "",

    role: "patient",
  });

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { user, registerEmail, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth,
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    dispatch(register(formData));
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    // if (isSuccess && user) {
    //   toast.success("Registration successful");

    //   if (user.role === "hospital_admin") {
    //     navigate("/hospital-admin");
    //   } else {
    //     navigate("/dashboard");
    //   }
    // }

    if(isSuccess){
      console.log("Redux Register Email:", registerEmail);
      toast.success(message)
      navigate("/verify-email",{
        state:{
          email:registerEmail,
        }
      })
    }

    dispatch(reset());
  }, [user, registerEmail, isSuccess, isError, message, navigate, dispatch]);

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
        {/* LEFT */}

        <div className="p-10 bg-blue-50">
          <img
            src="https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1200"
            alt="medical"
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
            MEDICAL
            <br />
            CARE
          </h1>

          <p
            className="
            mt-6
            text-gray-600
            text-lg
            leading-relaxed
            "
          >
            Find hospitals, emergency care and manage your medical services
            easily with our smart healthcare platform.
          </p>
        </div>

        {/* RIGHT */}

        <div
          className="
          flex
          items-center
          justify-center
          p-12
          "
        >
          <div className="w-full max-w-md">
            <h2
              className="
              text-3xl
              font-bold
              text-gray-900
              "
            >
              Create Account
            </h2>

            <p className="text-gray-500 mt-2">
              Register your healthcare profile
            </p>

            <form onSubmit={handleRegister} className="mt-8 space-y-5">
              <input
                name="name"
                value={formData.name}
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

              {/* ROLE SELECTION */}

              <div>
                <p className="text-gray-600 mb-3 font-medium">Register As</p>

                <div className="grid grid-cols-2 gap-4">
                  <label
                    className={`
                    cursor-pointer
                    rounded-xl
                    p-4
                    text-center
                    border

                    ${
                      formData.role === "patient"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }
                    `}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="patient"
                      checked={formData.role === "patient"}
                      onChange={handleChange}
                      className="hidden"
                    />
                    Patient
                  </label>

                  <label
                    className={`
                    cursor-pointer
                    rounded-xl
                    p-4
                    text-center
                    border

                    ${
                      formData.role === "hospital_admin"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }
                    `}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="hospital_admin"
                      checked={formData.role === "hospital_admin"}
                      onChange={handleChange}
                      className="hidden"
                    />
                    Hospital Admin
                  </label>
                </div>
              </div>

              <button
                disabled={isLoading}
                className="
                w-full
                bg-blue-600
                text-white
                py-4
                rounded-xl
                font-semibold
                hover:bg-blue-700
                "
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="my-6">
              <GoogleLoginButton />
            </div>

            <p className="text-center text-gray-500">
              Already have account?
              <Link to="/login" className="text-blue-600 ml-2 font-semibold">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
