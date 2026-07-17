import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import {
  getHospitalsForAdmin,
  approveHospital,
  rejectHospital,
  resetSuperAdmin,
} from "../../features/superAdmin/superAdminSlice";

import { motion } from "framer-motion";

import toast from "react-hot-toast";

const SuperAdminDashboard = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [page, setPage] = useState(1);

  const [status, setStatus] = useState("all");

  const {
    hospitals,
    pages,
    isLoading,
    isError,
    message,
  } = useSelector((state) => state.superAdmin);

  // ==============================
  // COUNTS
  // ==============================

  const totalHospitals = hospitals?.length || 0;

  const pendingHospitals =
    hospitals?.filter((hospital) => hospital.verification?.status === "pending")
      .length || 0;

  const approvedHospitals =
    hospitals?.filter(
      (hospital) => hospital.verification?.status === "approved",
    ).length || 0;

  // ==============================
  // LOAD DATA
  // ==============================

  useEffect(() => {

    dispatch(
      getHospitalsForAdmin({
        page,
        status,
      })
    );

  }, [dispatch, page, status]);

  useEffect(() => {

    return () => {
      dispatch(resetSuperAdmin());
    };

  }, [dispatch]);

  // ==============================
  // ERROR
  // ==============================

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  // ==============================
  // APPROVE
  // ==============================

  const approveHandler = (id) => {
    dispatch(approveHospital(id))
      .unwrap()

      .then(() => {
        toast.success("Hospital approved successfully");

        dispatch(
          getHospitalsForAdmin({
            page,
            status,
          })
        );
      })

      .catch((error) => {
        toast.error(error);
      });
  };

  // ==============================
  // REJECT
  // ==============================

  const rejectHandler = (id) => {
    dispatch(rejectHospital(id))
      .unwrap()

      .then(() => {
        toast.success("Hospital rejected");
      })

      .catch((error) => {
        toast.error(error);
      });
  };

  return (
    <div className="min-h-screen bg-slate-100 pt-24 px-8">

      {/* HEADER */}

      <div className="bg-white rounded-3xl shadow-lg p-8 flex justify-between items-center">

        <div>

          <h1 className="text-4xl font-bold text-slate-800">
            Hospital Verification Center
          </h1>

          <p className="text-gray-500 mt-2">
            Review and approve hospital registration requests
          </p>

        </div>

        <div className="flex gap-4">

          <input
            type="text"
            placeholder="Search hospital..."
            className="border rounded-xl px-4 py-3 w-72 outline-none"
          />

          <select className="border rounded-xl px-4 py-3">

            <option>All Status</option>

            <option>Pending</option>

            <option>Approved</option>

            <option>Rejected</option>

          </select>

        </div>

      </div>

      {/* STATUS FILTER */}

      <div className="flex flex-wrap gap-3 mt-10">

        {["all", "pending", "approved", "rejected"].map((item) => (

          <button
            key={item}
            onClick={() => {

              setStatus(item);

              setPage(1);

            }}
            className={`px-6 py-3 rounded-xl font-semibold transition

      ${status === item
                ? "bg-blue-600 text-white"
                : "bg-white border hover:bg-gray-100"
              }`}
          >

            {item.charAt(0).toUpperCase() + item.slice(1)}

          </button>

        ))}

      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-4 gap-6 mt-8">

        <div className="bg-white rounded-2xl shadow p-6">

          <h3 className="text-gray-500">
            Total Hospitals
          </h3>

          <h1 className="text-4xl font-bold mt-3 text-blue-600">
            {totalHospitals}
          </h1>

        </div>

        <div className="bg-white rounded-2xl shadow p-6">

          <h3 className="text-gray-500">
            Pending
          </h3>

          <h1 className="text-4xl font-bold mt-3 text-yellow-500">
            {pendingHospitals}
          </h1>

        </div>

        <div className="bg-white rounded-2xl shadow p-6">

          <h3 className="text-gray-500">
            Approved
          </h3>

          <h1 className="text-4xl font-bold mt-3 text-green-600">
            {approvedHospitals}
          </h1>

        </div>

        <div className="bg-white rounded-2xl shadow p-6">

          <h3 className="text-gray-500">
            Rejected
          </h3>

          <h1 className="text-4xl font-bold mt-3 text-red-500">
            0
          </h1>

        </div>

      </div>

      {/* TITLE */}

      <div className="mt-10">

        <h2 className="text-3xl font-bold">
          Pending Verification
        </h2>

      </div>

      {/* HOSPITAL LIST */}

      <div className="space-y-8 mt-8">

        {hospitals?.map((hospital) => (

          <div
            key={hospital._id}
            className="bg-white rounded-3xl shadow-lg overflow-hidden"
          >

            <div className="grid md:grid-cols-5">

              {/* IMAGE */}

              <div>

                <img
                  src={
                    hospital.images?.[0]?.url ||
                    "https://images.unsplash.com/photo-1538108149393-fbbd81895907"
                  }
                  className="h-full w-full object-cover"
                />

              </div>

              {/* DETAILS */}

              <div className="md:col-span-3 p-8">

                <div className="flex justify-between">

                  <div>

                    <h2 className="text-3xl font-bold">
                      {hospital.name}
                    </h2>

                    <p className="text-gray-500 mt-2">
                      {hospital.description}
                    </p>

                  </div>

                  <span className="bg-yellow-100 text-yellow-700 px-5 py-2 rounded-full font-semibold h-fit">

                    {hospital.verification?.status}

                  </span>

                </div>

                <div className="grid md:grid-cols-2 gap-5 mt-8">

                  <div>

                    <p>
                      <strong>Email :</strong>{" "}
                      {hospital.contact?.email}
                    </p>

                    <p className="mt-2">
                      <strong>Phone :</strong>{" "}
                      {hospital.contact?.phone}
                    </p>

                    <p className="mt-2">
                      <strong>Website :</strong>{" "}
                      {hospital.contact?.website || "N/A"}
                    </p>

                  </div>

                  <div>

                    <p>
                      <strong>City :</strong>{" "}
                      {hospital.address?.city}
                    </p>

                    <p className="mt-2">
                      <strong>State :</strong>{" "}
                      {hospital.address?.state}
                    </p>

                    <p className="mt-2">
                      <strong>Pincode :</strong>{" "}
                      {hospital.address?.pincode}
                    </p>

                  </div>

                </div>

                <div className="mt-8">

                  <h3 className="font-bold mb-3">

                    Uploaded Documents

                  </h3>

                  <div className="flex flex-wrap gap-3">

                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full">
                      Registration Certificate
                    </span>

                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full">
                      Hospital Images
                    </span>

                  </div>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="bg-slate-50 p-8 flex flex-col justify-center gap-4">

                <button
                  onClick={() =>
                    navigate(`/super-admin/hospital/${hospital._id}`)
                  }
                  className="bg-blue-600 text-white py-3 rounded-xl font-semibold"
                >
                  View Details
                </button>

                <button
                  onClick={() => approveHandler(hospital._id)}
                  className="bg-green-600 text-white py-3 rounded-xl font-semibold"
                >
                  Approve
                </button>

                <button
                  onClick={() => rejectHandler(hospital._id)}
                  className="bg-red-600 text-white py-3 rounded-xl font-semibold"
                >
                  Reject
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>
      {/* PAGINATION */}

      <div className="flex justify-center items-center gap-3 mt-10 pb-20">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 border rounded-lg disabled:opacity-40"
        >
          Previous
        </button>

        {[...Array(pages)].map((_, index) => (

          <button
            key={index}
            onClick={() => setPage(index + 1)}
            className={`w-10 h-10 rounded-lg font-semibold ${page === index + 1
              ? "bg-blue-600 text-white"
              : "bg-white border"
              }`}
          >
            {index + 1}
          </button>

        ))}

        <button
          disabled={page === pages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 border rounded-lg disabled:opacity-40"
        >
          Next
        </button>

      </div>

    </div>
  );
};

export default SuperAdminDashboard;
