import { useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import toast from "react-hot-toast";

import {
  getMyDoctors,
  deleteDoctor,
  resetDoctor,
} from "../../features/doctor/doctorSlice";

const ManageDoctors = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { myDoctors, isLoading, isError, message } = useSelector(
    (state) => state.doctor,
  );

  useEffect(() => {
    dispatch(getMyDoctors());

    return () => {
      dispatch(resetDoctor());
    };
  }, [dispatch]);

  const handleDelete = async (doctor) => {
    const confirmed = window.confirm(
      `Remove Dr. ${doctor.name} from your hospital? This cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      await dispatch(deleteDoctor(doctor._id)).unwrap();

      toast.success("Doctor removed");
    } catch (error) {
      toast.error(error || "Failed to delete doctor");
    }
  };

  return (
    <div
      className="
min-h-screen
bg-gray-100
pt-28
pb-20
px-6
"
    >
      <div
        className="
w-full
max-w-6xl
mx-auto
space-y-8
"
      >
        {/* HEADER */}

        <div
          className="
bg-white
rounded-3xl
shadow-sm
border
border-gray-200
p-8
flex
flex-col
md:flex-row
justify-between
items-start
md:items-center
gap-6
"
        >
          <div>
            <p className="text-sm text-gray-500 font-medium">
              Dashboard
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-blue-600 font-semibold">My Doctors</span>
            </p>

            <h1 className="text-4xl font-bold text-gray-900 mt-3">
              👨‍⚕️ My Doctors
            </h1>

            <p className="text-gray-500 mt-2 max-w-2xl">
              Edit a doctor's details or remove them from your hospital.
            </p>
          </div>

          <Link
            to="/hospital/add-doctor"
            className="
px-8
py-3
rounded-xl
bg-green-600
text-white
font-semibold
shadow-lg
hover:bg-green-700
transition
"
          >
            + Add Doctor
          </Link>
        </div>

        {/* LOADING / ERROR */}

        {isLoading && (
          <p className="text-center text-xl text-gray-500">
            Loading doctors...
          </p>
        )}

        {isError && (
          <p className="text-center text-xl text-red-500">{message}</p>
        )}

        {/* EMPTY STATE */}

        {!isLoading && !isError && myDoctors?.length === 0 && (
          <div
            className="
bg-white
rounded-3xl
shadow-sm
border
border-gray-200
p-12
text-center
"
          >
            <h2 className="text-2xl font-bold text-gray-800">
              No doctors added yet
            </h2>

            <p className="text-gray-500 mt-3">
              Add your first doctor to get started.
            </p>

            <Link
              to="/hospital/add-doctor"
              className="
inline-block
mt-6
bg-blue-600
text-white
px-8
py-3
rounded-xl
font-semibold
"
            >
              + Add Doctor
            </Link>
          </div>
        )}

        {/* DOCTOR LIST */}

        {myDoctors?.length > 0 && (
          <div
            className="
grid
md:grid-cols-2
lg:grid-cols-3
gap-8
"
          >
            {myDoctors.map((doctor) => (
              <div
                key={doctor._id}
                className="
bg-white
rounded-3xl
shadow-sm
border
border-gray-200
overflow-hidden
flex
flex-col
"
              >
                <img
                  src={
                    doctor.image ||
                    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1200"
                  }
                  alt={doctor.name}
                  className="h-48 w-full object-cover"
                />

                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    Dr. {doctor.name}
                  </h2>

                  <p className="text-blue-600 font-semibold mt-2">
                    {doctor.specialization}
                  </p>

                  <p className="text-gray-500 text-sm mt-1">
                    {doctor.department}
                  </p>

                  <p className="text-gray-500 text-sm mt-1">
                    {doctor.qualification} · {doctor.experience} yrs exp
                  </p>

                  <p className="text-green-600 font-semibold mt-3">
                    ₹ {doctor.consultationFee} Consultation
                  </p>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() =>
                        navigate(`/hospital/edit-doctor/${doctor._id}`)
                      }
                      className="
flex-1
bg-blue-600
text-white
py-3
rounded-xl
font-semibold
hover:bg-blue-700
transition
"
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => handleDelete(doctor)}
                      className="
flex-1
bg-red-50
text-red-600
py-3
rounded-xl
font-semibold
hover:bg-red-100
transition
"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageDoctors;