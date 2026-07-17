import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

const ForgotPassword = () => {

    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true);
            const { data } = await API.post("/auth/forgot-password", { email })
            toast.success(data.message)
            setEmail("");
            navigate("/reset-password", { state: { email }, })
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong!")
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="relative min-h-screen bg-slate-100 overflow-hidden flex items-center justify-center px-6 py-10">

            {/* Background Blur */}
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-40"></div>

            <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-200 rounded-full blur-3xl opacity-40"></div>

            <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2">

                {/* LEFT SIDE */}
                <div className="hidden lg:flex bg-linear-to-br from-blue-700 to-cyan-600 text-white p-12 flex-col justify-center">

                    <div className="mb-8">
                        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-5xl">
                            🏥
                        </div>
                    </div>

                    <h1 className="text-5xl font-bold leading-tight">
                        MediCare
                        <br />
                        Hospital
                    </h1>

                    <p className="mt-6 text-blue-100 text-lg leading-8">
                        Securely recover your account and continue managing your
                        appointments, prescriptions, and healthcare services.
                    </p>

                    <div className="mt-12 space-y-4">

                        <div className="flex items-center gap-3">
                            <span>✔</span>
                            <p>Secure OTP Verification</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <span>✔</span>
                            <p>HIPAA Inspired Security</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <span>✔</span>
                            <p>24/7 Patient Portal Access</p>
                        </div>

                    </div>

                </div>

                {/* RIGHT SIDE */}
                <div className="p-8 md:p-12">

                    <div className="text-center">

                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">

                            <span className="text-3xl">🔐</span>

                        </div>

                        <h2 className="text-3xl font-bold text-gray-800">
                            Forgot Password
                        </h2>

                        <p className="text-gray-500 mt-3 leading-7">
                            Enter your registered email address and we'll send you a
                            secure One-Time Password (OTP).
                        </p>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-10 space-y-6"
                    >

                        <div>

                            <label className="block mb-2 text-sm font-semibold text-gray-700">
                                Email Address
                            </label>

                            <input
                                type="email"
                                autoComplete="email"
                                placeholder="Enter your registered email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                className="w-full rounded-xl border border-gray-300 px-5 py-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:bg-gray-100"
                            />

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-blue-600 py-4 text-white font-semibold transition hover:bg-blue-700 hover:shadow-lg disabled:opacity-50"
                        >
                            {loading ? "Sending OTP..." : "Send OTP →"}
                        </button>

                    </form>

                    <div className="mt-8 rounded-xl bg-blue-50 border border-blue-100 p-4">

                        <h3 className="font-semibold text-blue-700">
                            🔒 Secure Password Recovery
                        </h3>

                        <p className="mt-2 text-sm text-gray-600">
                            Your verification code will expire in 10 minutes for
                            security purposes.
                        </p>

                    </div>

                    <div className="mt-8 text-center">

                        <Link
                            to="/login"
                            className="font-medium text-blue-600 hover:text-blue-700"
                        >
                            ← Back to Login
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ForgotPassword
