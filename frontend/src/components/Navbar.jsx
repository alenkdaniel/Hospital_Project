import { useState, useEffect, useRef } from "react";

import { Link, NavLink } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { logout } from "../redux/slices/authSlice";

import {
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";

import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const [profileOpen, setProfileOpen] = useState(false);

  const [manageOpen, setManageOpen] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);

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
    `relative pb-2 text-[16px] font-medium transition-all duration-300
    ${isActive
      ? "text-blue-600 after:absolute after:left-0 after:-bottom-2 after:h-0.5 after:w-full after:bg-blue-600"
      : "text-gray-600 hover:text-blue-600"
    }`;

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

        {/* LOGO */}

        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div
            className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-gradient-to-r
            from-blue-600
            to-cyan-500
            text-xl
            font-bold
            text-white
            "
          >
            M
          </div>

          <div>
            <h1 className="text-3xl font-bold text-blue-600">
              MediCare
            </h1>

            <p className="text-xs text-gray-500">
              Healthcare Platform
            </p>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}

        <div className="hidden lg:flex items-center gap-10">

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
                className="flex items-center gap-1 text-[16px] font-medium text-gray-600 transition-colors hover:text-blue-600"
              >
                Manage Hospital
                <ChevronDown
                  size={16}
                  className={`transition-transform ${manageOpen ? "rotate-180" : ""}`}
                />
              </button>

              {manageOpen && (
                <div
                  className="
                  absolute
                  left-0
                  top-10
                  w-56
                  rounded-2xl
                  border
                  bg-white
                  p-2
                  shadow-xl
                  "
                >
                  {hospitalAdminLinks.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setManageOpen(false)}
                      className={({ isActive }) =>
                        `block rounded-xl px-4 py-3 text-sm transition ${isActive
                          ? "bg-blue-50 font-semibold text-blue-600"
                          : "text-gray-700 hover:bg-gray-100"
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              )}
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
                onClick={() =>
                  setProfileOpen(!profileOpen)
                }
                className="
                flex
                items-center
                gap-2
                rounded-full
                border
                border-gray-200
                bg-white
                px-2
                py-2
                shadow-sm
                "
              >
                <div
                  className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-blue-600
                  text-white
                  font-bold
                  overflow-hidden
                  "
                >
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

                <ChevronDown size={18} />
              </button>

              {profileOpen && (
                <div
                  className="
                  absolute
                  right-0
                  top-14
                  w-72
                  rounded-2xl
                  border
                  bg-white
                  p-5
                  shadow-xl
                  "
                >
                  <h3 className="font-semibold">
                    {user.name}
                  </h3>

                  <p className="mt-1 text-sm capitalize text-gray-500">
                    {user.role.replace("_", " ")}
                  </p>

                  <hr className="my-4" />

                  <Link
                    to="/profile"
                    onClick={() =>
                      setProfileOpen(false)
                    }
                    className="flex items-center gap-2 py-2 hover:text-blue-600"
                  >
                    <User size={18} />
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="mt-2 flex items-center gap-2 py-2 text-red-600"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="font-medium text-gray-700 hover:text-blue-600"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="
                rounded-xl
                bg-blue-600
                px-6
                py-3
                font-semibold
                text-white
                transition
                hover:bg-blue-700
                "
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
            onClick={() =>
              setMobileOpen(!mobileOpen)
            }
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>

      </div>
      {/* MOBILE MENU */}

      {mobileOpen && (
        <div className="absolute left-0 top-20 w-full border-t bg-white shadow-xl lg:hidden">
          <div className="flex flex-col p-6">

            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-3 transition ${isActive
                    ? "bg-blue-50 font-semibold text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
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
                  className="rounded-lg px-4 py-3 hover:bg-gray-100"
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/my"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-3 hover:bg-gray-100"
                >
                  My Appointments
                </NavLink>
              </>
            )}

            {/* Hospital Admin */}

            {user?.role === "hospital_admin" && (
              <>
                <p className="mt-2 px-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Manage Hospital
                </p>

                {hospitalAdminLinks.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-4 py-3 hover:bg-gray-100"
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
                className="rounded-lg px-4 py-3 hover:bg-gray-100"
              >
                Doctor Panel
              </NavLink>
            )}

            {/* Super Admin */}

            {user?.role === "super_admin" && (
              <NavLink
                to="/super-admin"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 hover:bg-gray-100"
              >
                Admin Panel
              </NavLink>
            )}

            <hr className="my-5" />

            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => {
                    setProfileOpen(false);
                    setMobileOpen(false);
                  }}
                  className="rounded-lg px-4 py-3 hover:bg-gray-100"
                >
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="rounded-lg px-4 py-3 text-left text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl border border-blue-600 px-5 py-3 text-center font-semibold text-blue-600"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;