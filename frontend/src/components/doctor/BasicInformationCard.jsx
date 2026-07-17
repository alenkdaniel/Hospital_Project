const BasicInformationCard = ({
  form,
  handleChange,
}) => {
  return (
    <div
      className="
bg-white
border
border-gray-200
rounded-3xl
shadow-sm
p-8
space-y-8
"
    >
      {/* Heading */}

      <div>
        <h2
          className="
text-xl
font-semibold
text-gray-800
"
        >
          👨‍⚕️ Basic Information
        </h2>

        <p
          className="
text-sm
text-gray-500
mt-1
"
        >
          Enter the doctor's personal and professional details.
        </p>
      </div>

      <hr />

      {/* Form */}

      <div
        className="
grid
grid-cols-1
md:grid-cols-2
gap-6
"
      >
        {/* Doctor Name */}

        <div>
          <label className="block text-sm font-medium mb-2">
            Doctor Name
          </label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Dr. John Doe"
            className="
w-full
border
rounded-xl
p-3
outline-none
focus:ring-2
focus:ring-blue-500
"
          />
        </div>

        {/* Gender */}

        <div>
          <label className="block text-sm font-medium mb-2">
            Gender
          </label>

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="
w-full
border
rounded-xl
p-3
outline-none
focus:ring-2
focus:ring-blue-500
"
          >
            <option value="">
              Select Gender
            </option>

            <option value="Male">
              Male
            </option>

            <option value="Female">
              Female
            </option>

            <option value="Other">
              Other
            </option>
          </select>
        </div>

        {/* Department */}

        <div>
          <label className="block text-sm font-medium mb-2">
            Department
          </label>

          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className="
w-full
border
rounded-xl
p-3
outline-none
focus:ring-2
focus:ring-blue-500
"
          >
            <option value="">
              Select Department
            </option>

            <option value="Cardiology">
              Cardiology
            </option>

            <option value="Neurology">
              Neurology
            </option>

            <option value="Orthopedics">
              Orthopedics
            </option>

            <option value="Pediatrics">
              Pediatrics
            </option>

            <option value="Physician">
              Physician
            </option>

            <option value="Dermatology">
              Dermatology
            </option>

            <option value="ENT">
              ENT
            </option>

            <option value="Gynecology">
              Gynecology
            </option>
          </select>
        </div>

        {/* Specialization */}

        <div>
          <label className="block text-sm font-medium mb-2">
            Specialization
          </label>

          <input
            type="text"
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
            placeholder="Heart Specialist"
            className="
w-full
border
rounded-xl
p-3
outline-none
focus:ring-2
focus:ring-blue-500
"
          />
        </div>

        {/* Qualification */}

        <div>
          <label className="block text-sm font-medium mb-2">
            Qualification
          </label>

          <input
            type="text"
            name="qualification"
            value={form.qualification}
            onChange={handleChange}
            placeholder="MBBS, MD"
            className="
w-full
border
rounded-xl
p-3
outline-none
focus:ring-2
focus:ring-blue-500
"
          />
        </div>

        {/* Experience */}

        <div>
          <label className="block text-sm font-medium mb-2">
            Experience
          </label>

          <input
            type="number"
            name="experience"
            value={form.experience}
            onChange={handleChange}
            placeholder="10 Years"
            className="
w-full
border
rounded-xl
p-3
outline-none
focus:ring-2
focus:ring-blue-500
"
          />
        </div>

        {/* License */}

        <div>
          <label className="block text-sm font-medium mb-2">
            License Number
          </label>

          <input
            type="text"
            name="licenseNumber"
            value={form.licenseNumber}
            onChange={handleChange}
            placeholder="DOC-123456"
            className="
w-full
border
rounded-xl
p-3
outline-none
focus:ring-2
focus:ring-blue-500
"
          />
        </div>

        {/* Consultation Fee */}

        <div>
          <label className="block text-sm font-medium mb-2">
            Consultation Fee
          </label>

          <input
            type="number"
            name="consultationFee"
            value={form.consultationFee}
            onChange={handleChange}
            placeholder="500"
            className="
w-full
border
rounded-xl
p-3
outline-none
focus:ring-2
focus:ring-blue-500
"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInformationCard;