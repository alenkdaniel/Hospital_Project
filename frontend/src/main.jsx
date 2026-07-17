import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App.jsx";

// =====================================
// ROUTER
// =====================================

import { BrowserRouter } from "react-router-dom";

// =====================================
// REDUX
// =====================================

import { Provider } from "react-redux";

import store from "./redux/store";

// =====================================
// TOAST
// =====================================

import { Toaster } from "react-hot-toast";

// =====================================
// GOOGLE AUTH
// =====================================

import { GoogleOAuthProvider } from "@react-oauth/google";

// =====================================
// ROOT RENDER
// =====================================

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <BrowserRouter>
          <App />

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,

              success: {
                duration: 2000,
              },

              error: {
                duration: 4000,
              },
            }}
          />
        </BrowserRouter>
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
