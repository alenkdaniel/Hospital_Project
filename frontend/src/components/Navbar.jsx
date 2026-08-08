import { useState, useEffect, useRef } from "react";

import { Link, NavLink } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { logout } from "../redux/slices/authSlice";

import { motion, AnimatePresence } from "framer-motion";

import {
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  HeartPulse,
  LayoutDashboard,
  CalendarCheck,
  Building2,
} from "lucide-react";

import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const [profileOpen, setProfileOpen] = useState(false);

  const [manageOpen, setManageOpen] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  const profileRef = useRef(null);

  const manageRef = useRef(null);

  // Close either dropdown when clicking outside of it.
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }

      if (manageRef.current && !manageRef.current.contains(e.target)) {
        setManageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Give the navbar a "docked" look with a border/shadow once
  // the page has scrolled, and a lighter look at the very top.
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());

    setProfileOpen(false);

    setManageOpen(false);

    setMobileOpen(false);
  };

  const navLinks = [
    {
      name: "Find Care",
      path: "/",
    },
    {
      name: "Doctors",
      path: "/doctors",
    },
    {
      // "Find Near Me" inside the Hospitals page now covers
      // what the old standalone "Nearby Hospitals" link did,
      // so it isn't listed separately here anymore.
      name: "Hospitals",
      path: "/hospitals",
    },
    {
      name: "About",
      path: "/about",
    },
  ];

  // Hospital-admin-only links, grouped into one "Manage Hospital"
  // dropdown instead of 5 separate top-level nav items — that's
  // what was pushing the navbar onto two cramped rows.
  const hospitalAdminLinks = [
    {
      name: "Dashboard",
      path: "/hospital-admin",
    },
    {
      name: "Hospital",
      path: "/hospital/add-hospital",
    },
    {
      name: "Edit Hospital",
      path: "/hospital/edit-hospital",
    },
    {
      name: "Add Doctor",
      path: "/hospital/add-doctor",
    },
    {
      name: "Appointments",
      path: "/hospital/appointments",
    },
  ];

  const linkStyle = ({ isActive }) =>
    `relative pb-2 text-[15px] font-semibold transition-colors duration-200
    ${isActive
      ? "text-brand-700 after:absolute after:left-0 after:-bottom-2 after:h-0.5 after:w-full after:rounded-full after:bg-brand-600"
      : "text-ink-600 hover:text-brand-700"
    }`;

  return (
    <nav
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-ink-100 bg-white/90 shadow-sm backdrop-blur-lg"
          : "border-b border-transparent bg-white/70 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

        {/* LOGO */}

        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-700 to-brand-500 text-white shadow-md shadow-brand-700/20">
            <HeartPulse size={22} />
          </div>

          <div>
            <h1 className="font-display text-2xl font-extrabold leading-none text-ink-900">
              Medi<span className="text-brand-700">Care+</span>
            </h1>

            <p className="mt-0.5 text-xs text-ink-400">
              Healthcare Platform
            </p>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}

        <div className="hidden lg:flex items-center gap-9">

          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={linkStyle}
            >
              {item.name}
            </NavLink>
          ))}

          {user?.role === "patient" && (
            <>
              <NavLink
                to="/dashboard"
                className={linkStyle}
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/my"
                className={linkStyle}
              >
                Appointments
              </NavLink>
            </>
          )}

          {user?.role === "hospital_admin" && (
            <div className="relative" ref={manageRef}>
              <button
                type="button"
                onClick={() => setManageOpen(!manageOpen)}
                className={`flex items-center gap-1 text-[15px] font-semibold transition-colors ${
                  manageOpen ? "text-brand-700" : "text-ink-600 hover:text-brand-700"
                }`}
              >
                Manage Hospital
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${manageOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {manageOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-11 w-60 overflow-hidden rounded-2xl border border-ink-100 bg-white p-2 shadow-xl"
                  >
                    {hospitalAdminLinks.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setManageOpen(false)}
                        className={({ isActive }) =>
                          `block rounded-xl px-4 py-3 text-sm font-medium transition ${isActive
                            ? "bg-brand-50 text-brand-700"
                            : "text-ink-600 hover:bg-ink-50"
                          }`
                        }
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {user?.role === "doctor" && (
            <NavLink
              to="/doctor-dashboard"
              className={linkStyle}
            >
              Doctor Panel
            </NavLink>
          )}

          {user?.role === "super_admin" && (
            <NavLink
              to="/super-admin"
              className={linkStyle}
            >
              Admin Panel
            </NavLink>
          )}
        </div>

        {/* RIGHT SIDE */}

        <div className="hidden lg:flex items-center gap-4">

          {user && <NotificationBell />}

          {user ? (
            <div className="relative" ref={profileRef}>

              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full border border-ink-100 bg-white py-1.5 pl-1.5 pr-3 shadow-sm transition hover:border-brand-200 hover:shadow-md"
              >
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-700 to-brand-500 font-bold text-white">
                  {user.profileImage?.url ? (
                    <img
                      src={user.profileImage.url}
                      alt="profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    user.name?.charAt(0).toUpperCase()
                  )}
                </div>

                <ChevronDown
                  size={16}
                  className={`text-ink-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-14 w-72 overflow-hidden rounded-2xl border border-ink-100 bg-white p-5 shadow-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-700 to-brand-500 font-bold text-white">
                        {user.profileImage?.url ? (
                          <img
                            src={user.profileImage.url}
                            alt="profile"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          user.name?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-ink-900">
                          {user.name}
                        </h3>

                        <p className="mt-0.5 inline-block rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold capitalize text-brand-700">
                          {user.role.replace("_", " ")}
                        </p>
                      </div>
                    </div>

                    <hr className="my-4 border-ink-100" />

                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-2 py-2.5 font-medium text-ink-600 transition hover:bg-ink-50 hover:text-brand-700"
                    >
                      <User size={18} />
                      Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="mt-1 flex w-full items-center gap-2 rounded-xl px-2 py-2.5 text-left font-medium text-rose-600 transition hover:bg-rose-50"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-[15px] font-semibold text-ink-600 hover:text-brand-700"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-2xl bg-brand-700 px-6 py-3 text-[15px] font-semibold text-white shadow-md shadow-brand-700/20 transition hover:bg-brand-800"
              >
                Register
              </Link>
            </>
          )}

        </div>

        {/* MOBILE BUTTON */}

        <div className="flex items-center gap-3 lg:hidden">
          {user && <NotificationBell />}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink-100 bg-white text-ink-700 shadow-sm"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>
      {/* MOBILE MENU */}

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-20 w-full overflow-hidden border-t border-ink-100 bg-white shadow-xl lg:hidden"
          >
            <div className="flex flex-col p-6">

              {navLinks.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 font-medium transition ${isActive
                      ? "bg-brand-50 font-semibold text-brand-700"
                      : "text-ink-600 hover:bg-ink-50"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}

              {/* Patient */}

              {user?.role === "patient" && (
                <>
                  <NavLink
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-xl px-4 py-3 font-medium transition ${isActive
                        ? "bg-brand-50 font-semibold text-brand-700"
                        : "text-ink-600 hover:bg-ink-50"
                      }`
                    }
                  >
                    <LayoutDashboard size={17} />
                    Dashboard
                  </NavLink>

                  <NavLink
                    to="/my"
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-xl px-4 py-3 font-medium transition ${isActive
                        ? "bg-brand-50 font-semibold text-brand-700"
                        : "text-ink-600 hover:bg-ink-50"
                      }`
                    }
                  >
                    <CalendarCheck size={17} />
                    My Appointments
                  </NavLink>
                </>
              )}

              {/* Hospital Admin */}

              {user?.role === "hospital_admin" && (
                <>
                  <p className="mt-3 flex items-center gap-2 px-4 text-xs font-semibold uppercase tracking-wide text-ink-400">
                    <Building2 size={14} />
                    Manage Hospital
                  </p>

                  {hospitalAdminLinks.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `rounded-xl px-4 py-3 font-medium transition ${isActive
                          ? "bg-brand-50 font-semibold text-brand-700"
                          : "text-ink-600 hover:bg-ink-50"
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </>
              )}

              {/* Doctor */}

              {user?.role === "doctor" && (
                <NavLink
                  to="/doctor-dashboard"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 font-medium transition ${isActive
                      ? "bg-brand-50 font-semibold text-brand-700"
                      : "text-ink-600 hover:bg-ink-50"
                    }`
                  }
                >
                  Doctor Panel
                </NavLink>
              )}

              {/* Super Admin */}

              {user?.role === "super_admin" && (
                <NavLink
                  to="/super-admin"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 font-medium transition ${isActive
                      ? "bg-brand-50 font-semibold text-brand-700"
                      : "text-ink-600 hover:bg-ink-50"
                    }`
                  }
                >
                  Admin Panel
                </NavLink>
              )}

              <hr className="my-5 border-ink-100" />

              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => {
                      setProfileOpen(false);
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-2 rounded-xl px-4 py-3 font-medium text-ink-600 hover:bg-ink-50"
                  >
                    <User size={17} />
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-xl px-4 py-3 text-left font-medium text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-2xl border border-brand-600 px-5 py-3 text-center font-semibold text-brand-700"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-2xl bg-brand-700 px-5 py-3 text-center font-semibold text-white shadow-md shadow-brand-700/20"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;