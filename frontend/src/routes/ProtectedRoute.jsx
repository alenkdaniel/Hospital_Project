import { Navigate, useLocation } from "react-router-dom";

import { useSelector } from "react-redux";

// =====================================
// PROTECTED ROUTE
// =====================================

function ProtectedRoute({
  children,

  allowedRoles,
}) {
  const location = useLocation();

  const {
    user,

    isAuthenticated,

    isLoading,
  } = useSelector((state) => state.auth);

  // =====================================
  // LOADING STATE
  // =====================================

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // =====================================
  // USER NOT LOGIN
  // =====================================

  if (!user || !isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  // =====================================
  // ROLE CHECKING
  // =====================================

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // redirect based on actual role

    if (user.role === "patient") {
      return <Navigate to="/dashboard" replace />;
    }

    if (user.role === "hospital_admin") {
      return <Navigate to="/hospital-admin" replace />;
    }

    if (user.role === "doctor") {
      return <Navigate to="/doctor-dashboard" replace />;
    }

    if (user.role === "super_admin") {
      return <Navigate to="/super-admin" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
