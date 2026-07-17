import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { verifyEmail } from '../../redux/slices/authSlice'
import toast from 'react-hot-toast'



const VerifyEmail = () => {
    const [otp, setOtp] = useState('')
    const dispatch = useDispatch()
    const location = useLocation()
    console.log(location.state);
    const navigate = useNavigate()
    const email = location.state?.email

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            await dispatch(
                verifyEmail({
                    email,
                    otp
                })
            ).unwrap()
            toast.success("Email verified successfully");
            navigate("/login")
        } catch (error) {
            toast.error(error)
        }
    }
    if (!email) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>No email found. Please register first.</p>
            </div>
        );
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-2">
                    Verify Email
                </h2>
                <p className="text-gray-600 mb-6">
                    OTP has been sent to
                </p>
                <p className="font-semibold mb-6">
                    {email}
                </p>
                <form onSubmit={handleVerify}>
                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" className="w-full border rounded-lg p-3 mb-4 outline-none" />
                    <button type="submit" disabled={!otp}
                        className="w-full bg-blue-600 text-white p-3 rounded-lg"
                    >
                        Verify Email
                    </button>

                </form>



            </div>

        </div>
    )
}

export default VerifyEmail
