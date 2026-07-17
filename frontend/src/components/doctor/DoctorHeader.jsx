const DoctorHeader = ({ isLoading }) => {
  return (
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
lg:flex-row
justify-between
items-start
lg:items-center
gap-6
"
    >
      {/* Left */}

      <div>
        <p
          className="
text-sm
text-gray-500
font-medium
"
        >
          Dashboard
          <span className="mx-2 text-gray-400">/</span>
          Doctors
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-blue-600 font-semibold">
            Add Doctor
          </span>
        </p>

        <h1
          className="
text-4xl
font-bold
text-gray-900
mt-3
"
        >
          👨‍⚕️ Doctor Registration
        </h1>

        <p
          className="
text-gray-500
mt-2
max-w-2xl
"
        >
          Register a new doctor by providing personal details,
          contact information, professional qualifications,
          availability schedule, and profile image.
        </p>
      </div>

      {/* Right */}

      <div
        className="
flex
flex-wrap
gap-4
"
      >
        <button
          type="button"
          className="
px-6
py-3
rounded-xl
border
border-gray-300
text-gray-700
font-semibold
hover:bg-gray-100
transition
"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="
px-8
py-3
rounded-xl
bg-blue-600
text-white
font-semibold
shadow-lg
hover:bg-blue-700
disabled:opacity-50
disabled:cursor-not-allowed
transition
"
        >
          {isLoading
            ? "Creating..."
            : "Create Doctor"}
        </button>
      </div>
    </div>
  );
};

export default DoctorHeader;