import { GoogleLogin } from "@react-oauth/google";

import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { googleAuth } from "../redux/slices/authSlice";

function GoogleLoginButton() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleSuccess = async (response) => {
    try {
      const result = await dispatch(
        googleAuth({
          credential: response.credential,
        }),
      ).unwrap();

      toast.success("Login successful");

      // ROLE REDIRECT

      if (result.role === "hospital_admin") {
        navigate("/hospital-admin");
      } else if (result.role === "doctor") {
        navigate("/doctor-dashboard");
      } else if (result.role === "super_admin") {
        navigate("/super-admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error || "Google login failed");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => {
        toast.error("Google authentication failed");
      }}
    />
  );
}

export default GoogleLoginButton;
