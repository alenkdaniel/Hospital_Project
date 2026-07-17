import { useState } from "react";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

const ResetPassword = () => {

    const location = useLocation();

    const navigate = useNavigate();

    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");

    const [newPassword, setNewPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [countdown, setCountdown] = useState(60);

    const [resending, setResending] = useState(false);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!email) {
            navigate("/forgot-password");
        }
    }, [email, navigate]);

    useEffect(() => {
        if (countdown <= 0) return;

        const timer = setTimeout(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown]);


    const handleSubmit = async (e) => {
        e.preventDefault()

        if (loading || resending) return;

        if (otp.length !== 6) {
            return toast.error("Please enter a valid 6-digit OTP");
        }

        if (newPassword.length < 8) {
            return toast.error("Password must be at least 8 characters");
        }
        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match")
        }
        try {
            setLoading(true)

            const { data } = await API.post("/auth/reset-password", { email, otp: otp.trim(), newPassword })

            toast.success(data.message || "Password reset successfully");

            setOtp("");
            setNewPassword("");
            setConfirmPassword("");


            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    }

    const handleResendOTP = async () => {
        try {
            setResending(true);

            const { data } = await API.post("/auth/forgot-password", {
                email,
            });

            toast.success(data.message);

            setCountdown(60);

            setOtp("");

        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to resend OTP"
            );
        } finally {
            setResending(false);
        }
    };


    return (
        <div className="relative min-h-screen bg-slate-100 overflow-hidden flex items-center justify-center px-6 py-10">

            {/* Background Blur */}
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-40"></div>

            <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-200 rounded-full blur-3xl opacity-40"></div>

            <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2">

                {/* LEFT SIDE */}
                <div className="hidden lg:flex bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white p-12 flex-col justify-center">

                    <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-5xl mb-8">
                        🏥
                    </div>

                    <h1 className="text-5xl font-bold leading-tight">
                        MediCare
                        <br />
                        Hospital
                    </h1>

                    <p className="mt-6 text-blue-100 text-lg leading-8">
                        Reset your password securely and continue accessing your
                        appointments, medical records and healthcare services.
                    </p>

                    <div className="mt-12 space-y-5">

                        <div className="flex items-center gap-3">
                            <span className="text-xl">✔</span>
                            <p>256-bit Secure Authentication</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-xl">✔</span>
                            <p>OTP Protected Password Reset</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-xl">✔</span>
                            <p>Trusted by Thousands of Patients</p>
                        </div>

                    </div>

                </div>

                {/* RIGHT SIDE */}
                <div className="p-8 md:p-12">

                    <div className="text-center">

                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-5">
                            <span className="text-3xl">🔐</span>
                        </div>

                        <h2 className="text-3xl font-bold text-gray-800">
                            Reset Password
                        </h2>

                        <p className="text-gray-500 mt-3">
                            Enter the OTP sent to your email and create a new password.
                        </p>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5 mt-8"
                    >

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>

                            <input
                                type="email"
                                value={email}
                                readOnly
                                disabled={loading || resending}
                                className="w-full rounded-xl border border-gray-300 bg-gray-100 px-5 py-4"
                            />

                        </div>

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Verification OTP
                            </label>

                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                disabled={loading || resending}
                                onChange={(e) =>
                                    setOtp(e.target.value.replace(/\D/g, ""))
                                }
                                className="w-full rounded-xl border border-gray-300 px-5 py-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition"
                            />

                            <p className="text-xs text-gray-500 mt-2">
                                OTP expires in 10 minutes.
                            </p>

                        </div>

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                New Password
                            </label>

                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                disabled={loading || resending}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full rounded-xl border border-gray-300 px-5 py-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition"
                            />

                        </div>

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                disabled={loading || resending}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full rounded-xl border border-gray-300 px-5 py-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition"
                            />

                        </div>

                        <button
                            type="submit"
                            disabled={loading || resending}
                            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 py-4 text-white font-semibold transition hover:shadow-lg disabled:opacity-50"
                        >
                            {loading ? "Resetting Password..." : "Reset Password"}
                        </button>

                        <div className="text-center">

                            {countdown > 0 ? (

                                <p className="text-gray-500 text-sm">
                                    Resend OTP in <span className="font-semibold">{countdown}s</span>
                                </p>

                            ) : (

                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={loading || resending}
                                    className="font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50"
                                >
                                    {resending ? "Sending OTP..." : "Resend OTP"}
                                </button>

                            )}

                        </div>

                    </form>

                    <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-4">

                        <h3 className="font-semibold text-blue-700">
                            Security Notice
                        </h3>

                        <p className="text-sm text-gray-600 mt-2">
                            For your protection, your OTP expires after 10 minutes and
                            becomes invalid once your password has been successfully reset.
                        </p>

                    </div>

                    <div className="text-center mt-8">

                        <Link
                            to={loading || resending ? "#" : "/login"}
                            className={`font-medium text-blue-600 hover:text-blue-700 ${loading || resending
                                    ? "pointer-events-none opacity-50"
                                    : ""
                                }`}
                        >
                            ← Back to Login
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ResetPassword
