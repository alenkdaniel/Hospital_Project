import { Routes, Route } from "react-router-dom";

// =====================================
// COMPONENTS
// =====================================

import Navbar from "./components/Navbar";

// =====================================
// ROUTE GUARDS
// =====================================

import ProtectedRoute from "./routes/ProtectedRoute";

import PublicRoute from "./routes/PublicRoute";

// =====================================
// PUBLIC PAGES
// =====================================

import Home from "./pages/Home";

import About from "./pages/About";

// =====================================
// AUTH
// =====================================

import Register from "./pages/auth/Register";

import VerifyEmail from "./pages/email/VerifyEmail";

import Login from "./pages/auth/Login";

import HospitalRegister from "./pages/hospital/HospitalAdminRegister";

// =====================================
// PROFILE
// =====================================

import Profile from "./pages/profile/Profile";

// =====================================
// PATIENT
// =====================================

import Dashboard from "./pages/dashboard/Dashboard";

import BookAppointment from "./pages/appointment/BookAppointment";

import MyAppointments from "./pages/appointment/MyAppointments";

import AppointmentDetails from "./pages/appointment/AppointmentDetails";

import RescheduleAppointment from "./pages/appointment/RescheduleAppointment";

// =====================================
// HOSPITAL
// =====================================

import Hospitals from "./pages/hospital/Hospitals";

import HospitalDetails from "./pages/hospital/HospitalDetails";

import HospitalAdminDashboard from "./pages/hospital/HospitalDashboard";

import HospitalAppointments from "./pages/hospital/HospitalAppointments";

import AddHospital from "./pages/hospital/AddHospital";

import HospitalVerification from "./pages/hospital/HospitalVerification";

// =====================================
// DOCTOR
// =====================================

import Doctors from "./pages/hospital/Doctors";

import AddDoctor from "./pages/hospital/AddDoctor";

import DoctorDashboard from "./pages/doctor/DoctorDashboard";

import SetPassword from "./pages/auth/SetPassword";

// =====================================
// SUPER ADMIN
// =====================================

import SuperAdminDashboard from "./pages/superAdmin/SuperAdminDashboard";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import Footer from "./components/Footer";
function App() {
  return (
    <>
      <Navbar />
      <main  className="pt-28">

      <Routes>
        {/* =========================
PUBLIC
========================= */}

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/hospitals" element={<Hospitals />} />

        <Route path="/hospitals/:id" element={<HospitalDetails />} />

        <Route
          path="/super-admin/hospital/:id"
          element={
            <ProtectedRoute allowedRoles={["super_admin"]}>
              <HospitalVerification />
            </ProtectedRoute>
          }
        />

        <Route path="/doctors" element={<Doctors />} />

        {/* =========================
AUTH
========================= */}

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/verify-email"
          element={<VerifyEmail />}
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/reset-password"

          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/hospital-register"
          element={
            <PublicRoute>
              <HospitalRegister />
            </PublicRoute>
          }
        />

        {/* =========================
COMMON PROFILE
========================= */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute
              allowedRoles={[
                "patient",

                "hospital_admin",

                "doctor",

                "super_admin",
              ]}
            >
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* =========================
PATIENT
========================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/book-appointment/:doctorId"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <BookAppointment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <MyAppointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments/:id"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <AppointmentDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments/:id/reschedule"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <RescheduleAppointment />
            </ProtectedRoute>
          }
        />

        {/* =========================
HOSPITAL ADMIN
========================= */}

        <Route
          path="/hospital-admin"
          element={
            <ProtectedRoute allowedRoles={["hospital_admin"]}>
              <HospitalAdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hospital/add-hospital"
          element={
            <ProtectedRoute allowedRoles={["hospital_admin"]}>
              <AddHospital />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hospital/add-doctor"
          element={
            <ProtectedRoute allowedRoles={["hospital_admin"]}>
              <AddDoctor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hospital/appointments"
          element={
            <ProtectedRoute allowedRoles={["hospital_admin"]}>
              <HospitalAppointments />
            </ProtectedRoute>
          }
        />

        {/* =========================
DOCTOR
========================= */}

        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/set-password"
          element={<SetPassword />}
        />

        {/* =========================
SUPER ADMIN
========================= */}

        <Route
          path="/super-admin"
          element={
            <ProtectedRoute allowedRoles={["super_admin"]}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* =========================
404
========================= */}

        <Route
          path="*"
          element={
            <div
              className="
min-h-screen
flex
items-center
justify-center
"
            >
              <h1
                className="
text-5xl
font-bold
text-gray-700
"
              >
                404 Page Not Found
              </h1>
            </div>
          }
        />
      </Routes>
      </main>
      <Footer/>
    </>
  );
}

export default App;
