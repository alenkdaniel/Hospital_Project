import API from "../../api/axios";

// =====================================
// REGISTER USER
// Patient + Hospital Admin
// =====================================

const register = async (userData) => {
  const response = await API.post("/auth/register", userData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  // if (response.data.accessToken) {
  //   localStorage.setItem("accessToken", response.data.accessToken);

  //   localStorage.setItem("refreshToken", response.data.refreshToken);

  //   localStorage.setItem("user", JSON.stringify(response.data));
  // }

  

  return response.data;
};

// =====================================
// LOGIN USER
// =====================================

const login = async (loginData) => {

  const response = await API.post("/auth/login", loginData);


  if (response.data.accessToken) {
    localStorage.setItem("accessToken", response.data.accessToken);

    localStorage.setItem("refreshToken", response.data.refreshToken);

    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

// =====================================
// GOOGLE AUTH
// =====================================

const googleAuth = async (data) => {
  const response = await API.post("/auth/google", data);

  if (response.data.accessToken) {
    localStorage.setItem("accessToken", response.data.accessToken);

    localStorage.setItem("refreshToken", response.data.refreshToken);

    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

// =====================================
// VERIFY EMAIL OTP
// =====================================

const verifyEmail = async (data) => {
  const response = await API.post(
    "/auth/verify-email",

    data,
  );

  return response.data;
};

// =====================================
// UPDATE PROFILE
// =====================================

const updateProfile = async (data) => {
  const response = await API.put(
    "/auth/profile",

    data,

    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  const oldUser = JSON.parse(localStorage.getItem("user"));

  const updatedUser = {
    ...oldUser,

    ...response.data,
  };

  localStorage.setItem(
    "user",

    JSON.stringify(updatedUser),
  );

  return response.data;
};

// =====================================
// LOGOUT
// =====================================

const logout = async () => {
  try {
    await API.post("/auth/logout");
  } finally {
    localStorage.removeItem("accessToken");

    localStorage.removeItem("refreshToken");

    localStorage.removeItem("user");
  }
};

// =====================================
// CURRENT USER
// =====================================

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const authService = {
  register,

  login,

  googleAuth,

  verifyEmail,

  updateProfile,

  logout,

  getCurrentUser,
};

export default authService;
