import API from "../../api/axios";

import toast from "react-hot-toast";

// =====================================
// CREATE RAZORPAY ORDER
//
// Patient
// =====================================

const createPaymentOrder = async (appointmentId) => {
  const response = await API.post(
    "/payments/create-order",

    {
      appointmentId,
    },
  );

  return response.data;
};

// =====================================
// VERIFY PAYMENT
//
// Razorpay Success Callback
// =====================================

const verifyPayment = async (paymentData) => {
  const response = await API.post(
    "/payments/verify",

    paymentData,
  );

  return response.data;
};

// =====================================
// LOAD RAZORPAY SCRIPT
//
// Frontend SDK
// =====================================

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // const script = document.createElement("script");

    if (window.Razorpay) {
      return resolve(true);
    }

    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

// =====================================
// OPEN RAZORPAY CHECKOUT
// =====================================

const openRazorpayCheckout = async ({
  order,

  user,

  onSuccess,
}) => {
  const loaded = await loadRazorpayScript();

  if (!loaded) {
    throw new Error("Razorpay SDK failed to load");
  }

  const options = {
    key: order.key,

    amount: order.amount,

    currency: order.currency,

    name: "Hospital Booking",

    description: "Doctor Appointment Payment",

    order_id: order.orderId,

    handler: async (response) => {
      await onSuccess(response);
    },
    modal: {
      ondismiss: () => {
        toast("Payment cancelled.");
      },
    },

    prefill: {
      name: user?.name || "",

      email: user?.email || "",

      contact: user?.phone || "",
    },

    theme: {
      color: "#2563eb",
    },
  };

  if (!window.Razorpay) {
    throw new Error("Razorpay SDK not available");
  }

  const paymentObject = new window.Razorpay(options);

  paymentObject.on("payment.failed", function (response) {
    console.error("Payment Failed:", response.error);

    toast.error(response.error.description || "Payment Failed");
  });

  paymentObject.open();
};

// =====================================
// EXPORT SERVICE
// =====================================

const paymentService = {
  createPaymentOrder,

  verifyPayment,

  openRazorpayCheckout,
};

export default paymentService;
