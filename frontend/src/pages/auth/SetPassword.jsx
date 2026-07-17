import { useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import API from "../../api/axios";

import toast from "react-hot-toast";

const SetPassword = () => {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      const { data } = await API.post(
        "/auth/set-password",
        {
          token,
          password,
        }
      );

      toast.success(data.message);

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <div
      className="
min-h-screen
flex
items-center
justify-center
bg-gray-100
"
    >
      <form
        onSubmit={handleSubmit}
        className="
bg-white
p-10
rounded-2xl
shadow-xl
w-[400px]
"
      >
        <h1
          className="
text-3xl
font-bold
mb-8
text-center
"
        >
          Set Password
        </h1>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="
w-full
border
rounded-lg
p-3
mb-5
"
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
          className="
w-full
border
rounded-lg
p-3
mb-8
"
          required
        />

        <button
          className="
w-full
bg-blue-600
text-white
py-3
rounded-lg
font-semibold
"
        >
          Save Password
        </button>
      </form>
    </div>
  );
};

export default SetPassword;