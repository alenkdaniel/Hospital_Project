import Razorpay from "razorpay";

// =================================
// RAZORPAY CONFIGURATION
// =================================

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,

  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default razorpay;
