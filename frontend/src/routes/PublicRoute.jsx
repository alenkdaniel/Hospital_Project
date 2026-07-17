import { Navigate } from "react-router-dom";

import { useSelector } from "react-redux";

// =====================================
// PUBLIC ROUTE
//
// Login
// Register
//
// Only guests can access
// =====================================

function PublicRoute({ children }) {
  const {
    user,

    isAuthenticated,

    isLoading,
  } = useSelector((state) => state.auth);

  // =====================================
  // LOADING CHECK
  // =====================================

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // =====================================
  // ALREADY LOGGED IN
  // =====================================

  if (user && isAuthenticated) {
    // PATIENT

    if (user.role === "patient") {
      return <Navigate to="/dashboard" replace />;
    }

    // HOSPITAL ADMIN

    if (user.role === "hospital_admin") {
      return <Navigate to="/hospital-admin" replace />;
    }

    // DOCTOR

    if (user.role === "doctor") {
      return <Navigate to="/doctor-dashboard" replace />;
    }

    // SUPER ADMIN

    if (user.role === "super_admin") {
      return <Navigate to="/super-admin" replace />;
    }

    // FALLBACK

    return <Navigate to="/" replace />;
  }

  return children;
}

export default PublicRoute;
