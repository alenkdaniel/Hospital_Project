import { Link, useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { register, reset } from "../../redux/slices/authSlice";

import toast from "react-hot-toast";

import { motion } from "framer-motion";

import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  UserPlus,
  ArrowRight,
  HeartPulse,
  Stethoscope,
  Building2,
  CheckCircle2,
  Ambulance,
  Users,
} from "lucide-react";

import GoogleLoginButton from "../../components/GoogleLoginButton";

const FEATURES = [
  {
    icon: Stethoscope,
    title: "Trusted specialists",
    desc: "Browse verified doctors across every department near you.",
  },
  {
    icon: Ambulance,
    title: "Emergency ready",
    desc: "See which hospitals have 24/7 emergency care in one glance.",
  },
  {
    icon: Users,
    title: "Built for everyone",
    desc: "Patients and hospital admins each get a tailored dashboard.",
  },
];

const ROLES = [
  {
    value: "patient",
    label: "Patient",
    desc: "Book appointments & manage care",
    icon: User,
  },
  {
    value: "hospital_admin",
    label: "Hospital Admin",
    desc: "Manage doctors & appointments",
    icon: Building2,
  },
];

function Register() {
  const [formData, setFormData] = useState({
    name: "",

    email: "",

    password: "",

    role: "patient",
  });

  const [showPassword, setShowPassword] = useState(false);

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-50 px-6 pt-20 pb-16">
      {/* ambient background glow */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-brand-100/60 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-ink-100 bg-white shadow-2xl md:grid-cols-2"
      >
        {/* LEFT */}

        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 p-12 text-white md:flex">
          {/* decorative pattern */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-white/5" />

          <div className="relative">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <HeartPulse size={24} />
            </span>

            <h1 className="mt-8 text-4xl font-extrabold leading-tight">
              Join MediCare+
              <br />
              healthcare, simplified
            </h1>

            <p className="mt-4 max-w-sm text-brand-50/90">
              Create an account to find hospitals, book doctors and manage
              medical services with ease.
            </p>
          </div>

          <div className="relative mt-10 space-y-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="mt-0.5 text-sm text-brand-50/80">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}

        <div className="flex items-center justify-center p-8 sm:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 md:hidden">
              <HeartPulse size={22} />
            </div>

            <h2 className="text-3xl font-extrabold text-ink-900">
              Create your account
            </h2>

            <p className="mt-2 text-ink-500">
              Register your healthcare profile
            </p>

            <form onSubmit={handleRegister} className="mt-8 space-y-4">
              <div className="relative">
                <User
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
                />
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  className="w-full rounded-2xl border border-transparent bg-ink-50 p-4 pl-12 text-ink-900 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
                />
              </div>

              <div className="relative">
                <Mail
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
                />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  className="w-full rounded-2xl border border-transparent bg-ink-50 p-4 pl-12 text-ink-900 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
                />
              </div>

              <div className="relative">
                <Lock
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
                />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  className="w-full rounded-2xl border border-transparent bg-ink-50 p-4 pl-12 pr-12 text-ink-900 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 transition hover:text-ink-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* ROLE SELECTION */}

              <div>
                <p className="mb-3 text-sm font-semibold text-ink-600">
                  Register As
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {ROLES.map(({ value, label, desc, icon: Icon }) => {
                    const isActive = formData.role === value;
                    return (
                      <label
                        key={value}
                        className={`relative cursor-pointer rounded-2xl border p-4 transition ${
                          isActive
                            ? "border-brand-600 bg-brand-50"
                            : "border-ink-200 bg-white hover:border-brand-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={value}
                          checked={isActive}
                          onChange={handleChange}
                          className="hidden"
                        />

                        {isActive && (
                          <CheckCircle2
                            size={18}
                            className="absolute right-3 top-3 text-brand-600"
                          />
                        )}

                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                            isActive
                              ? "bg-brand-600 text-white"
                              : "bg-ink-100 text-ink-500"
                          }`}
                        >
                          <Icon size={16} />
                        </span>

                        <p
                          className={`mt-3 text-sm font-bold ${
                            isActive ? "text-brand-800" : "text-ink-900"
                          }`}
                        >
                          {label}
                        </p>
                        <p className="mt-0.5 text-xs text-ink-500">{desc}</p>
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-700 py-4 font-semibold text-white shadow-lg shadow-brand-700/20 transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  "Creating Account..."
                ) : (
                  <>
                    <UserPlus size={18} />
                    Create Account
                    <ArrowRight size={16} className="ml-auto" />
                  </>
                )}
              </button>
            </form>

            <div className="my-6">
              <GoogleLoginButton />
            </div>

            <p className="text-center text-ink-500">
              Already have account?
              <Link
                to="/login"
                className="ml-2 font-semibold text-brand-700 hover:text-brand-800"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;