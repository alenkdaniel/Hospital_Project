import { useEffect } from "react";

import { useParams } from "react-router-dom";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { useDispatch, useSelector } from "react-redux";

import {
    getHospitalById,
    resetHospital,
} from "../../features/hospital/hospitalSlice";

import {
    approveHospital,
    rejectHospital,
} from "../../features/superAdmin/superAdminSlice";

const HospitalVerification = () => {

    const { id } = useParams();

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const {
        hospital,
        isLoading,
    } = useSelector((state) => state.hospital);

    useEffect(() => {

        dispatch(getHospitalById(id));

        return () => {
            dispatch(resetHospital());
        };

    }, [dispatch, id]);

    if (isLoading || !hospital) {
        return (
            <div className="pt-28 text-center text-2xl">
                Loading...
            </div>
        );
    }

    const approveHandler = () => {

        dispatch(approveHospital(hospital._id))
            .unwrap()
            .then(() => {

                toast.success("Hospital approved successfully");

                navigate("/super-admin");

            })
            .catch((error) => {

                toast.error(error);

            });

    };

    const rejectHandler = () => {

        dispatch(rejectHospital(hospital._id))
            .unwrap()
            .then(() => {

                toast.success("Hospital rejected");

                navigate("/super-admin");

            })
            .catch((error) => {

                toast.error(error);

            });

    };

    return (
        <div className="min-h-screen bg-slate-100 pt-28 pb-16">

            <div className="max-w-7xl mx-auto px-6">

                {/* HEADER */}

                <div className="bg-white rounded-3xl shadow-lg p-8">

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

                        <div>

                            <h1 className="text-4xl font-bold text-slate-800">
                                {hospital.name}
                            </h1>

                            <p className="text-gray-500 mt-2">
                                Hospital Verification Details
                            </p>

                            <div className="flex items-center gap-3 mt-5">

                                <span
                                    className={`px-5 py-2 rounded-full text-sm font-semibold
                ${hospital.verification?.status === "approved"
                                            ? "bg-green-100 text-green-700"
                                            : hospital.verification?.status === "rejected"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {hospital.verification?.status?.toUpperCase()}
                                </span>

                            </div>

                        </div>

                        <div className="flex gap-4">

                            <button
                                onClick={approveHandler}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
                            >
                                Approve
                            </button>

                            <button
                                onClick={rejectHandler}
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold"
                            >
                                Reject
                            </button>

                        </div>

                    </div>

                </div>

                {/* BASIC INFORMATION */}

                <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

                    <h2 className="text-2xl font-bold mb-6">
                        Basic Information
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">

                        <div>

                            <label className="text-gray-500">
                                Hospital Name
                            </label>

                            <p className="font-semibold text-lg">
                                {hospital.name}
                            </p>

                        </div>

                        <div>

                            <label className="text-gray-500">
                                Email
                            </label>

                            <p className="font-semibold">
                                {hospital.contact?.email}
                            </p>

                        </div>

                        <div>

                            <label className="text-gray-500">
                                Phone
                            </label>

                            <p className="font-semibold">
                                {hospital.contact?.phone}
                            </p>

                        </div>

                        <div>

                            <label className="text-gray-500">
                                Status
                            </label>

                            <p className="font-semibold capitalize">
                                {hospital.verification?.status}
                            </p>

                        </div>

                    </div>

                </div>

                {/* ADDRESS */}

                <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

                    <h2 className="text-2xl font-bold mb-6">
                        Address
                    </h2>

                    <div className="space-y-3">

                        <p>
                            <strong>Street :</strong> {hospital.address?.street}
                        </p>

                        <p>
                            <strong>City :</strong> {hospital.address?.city}
                        </p>

                        <p>
                            <strong>State :</strong> {hospital.address?.state}
                        </p>

                        <p>
                            <strong>Pincode :</strong> {hospital.address?.pincode}
                        </p>

                    </div>

                </div>

                {/* VERIFICATION DOCUMENTS

                <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

                    <h2 className="text-2xl font-bold mb-8">
                        Verification Documents
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">

                        Registration Number

                        <div className="bg-gray-50 rounded-2xl p-6">

                            <h3 className="text-gray-500 font-medium">
                                Registration Number
                            </h3>

                            <p className="text-xl font-bold mt-2">
                                {hospital.verification?.documents?.registrationNumber || "Not Provided"}
                            </p>

                        </div>

                        License Number

                        <div className="bg-gray-50 rounded-2xl p-6">

                            <h3 className="text-gray-500 font-medium">
                                License Number
                            </h3>

                            <p className="text-xl font-bold mt-2">
                                {hospital.verification?.documents?.licenseNumber || "Not Provided"}
                            </p>

                        </div>

                    </div>

                </div> */}
                {/* CERTIFICATE */}

                <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

                    <h2 className="text-2xl font-bold mb-8">
                        Registration Certificate
                    </h2>

                    {hospital.verification?.documents?.certificateUrl ? (

                        <div className="flex gap-4">

                            <a
                                href={hospital.verification.documents.certificateUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-600 text-white px-6 py-3 rounded-xl"
                            >
                                View Certificate
                            </a>

                            <a
                                href={hospital.verification.documents.certificateUrl}
                                download
                                className="bg-green-600 text-white px-6 py-3 rounded-xl"
                            >
                                Download
                            </a>

                        </div>

                    ) : (

                        <p className="text-red-500">
                            Certificate not uploaded.
                        </p>

                    )}

                </div>

                {/* HOSPITAL IMAGES */}

                <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

                    <h2 className="text-2xl font-bold mb-8">
                        Hospital Images
                    </h2>

                    {hospital.images?.length > 0 ? (

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {hospital.images.map((image, index) => (

                                <img
                                    key={index}
                                    src={image.url}
                                    alt={`Hospital ${index + 1}`}
                                    className="w-full h-64 object-cover rounded-2xl shadow"
                                />

                            ))}

                        </div>

                    ) : (

                        <p className="text-gray-500">
                            No hospital images uploaded.
                        </p>

                    )}

                </div>
                {/* HOSPITAL ADMIN */}

                <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

                    <h2 className="text-2xl font-bold mb-8">
                        Hospital Administrator
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">

                        <div>

                            <p className="text-gray-500">
                                Name
                            </p>

                            <h3 className="font-semibold text-lg">
                                {hospital.createdBy?.name || "Not Available"}
                            </h3>

                        </div>

                        <div>

                            <p className="text-gray-500">
                                Email
                            </p>

                            <h3 className="font-semibold text-lg">
                                {hospital.createdBy?.email || "Not Available"}
                            </h3>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default HospitalVerification;