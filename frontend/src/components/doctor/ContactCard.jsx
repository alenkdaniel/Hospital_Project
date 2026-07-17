import ImageUpload from "../ImageUpload";

const ContactCard = ({ form, handleChange, doctorImage, setDoctorImage }) => {
  return (
    <div
      className="
bg-white
rounded-3xl
shadow-sm
border
border-gray-200
p-8
"
    >
      {/* Header */}

      <div className="mb-8">
        <h2
          className="
text-2xl
font-bold
text-gray-800
"
        >
          Contact Information
        </h2>

        <p
          className="
text-gray-500
mt-2
"
        >
          Add the doctor's contact details and profile picture.
        </p>
      </div>

      {/* Content */}

      <div
        className="
grid
grid-cols-1
lg:grid-cols-2
gap-10
"
      >
        {/* Left Side */}

        <div className="space-y-6">
          {/* Email */}

          <div>
            <label
              className="
block
text-sm
font-semibold
text-gray-700
mb-2
"
            >
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="doctor@gmail.com"
              className="
w-full
border
border-gray-300
rounded-xl
px-4
py-3
outline-none
focus:ring-2
focus:ring-blue-500
"
            />
          </div>

          {/* Phone */}

          <div>
            <label
              className="
block
text-sm
font-semibold
text-gray-700
mb-2
"
            >
              Phone Number
            </label>

            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 9876543210"
              className="
w-full
border
border-gray-300
rounded-xl
px-4
py-3
outline-none
focus:ring-2
focus:ring-blue-500
"
            />
          </div>
        </div>

        {/* Right Side */}

        <div>
          <label
            className="
block
text-sm
font-semibold
text-gray-700
mb-3
"
          >
            Doctor Profile Photo
          </label>

          <ImageUpload
            label="Upload Doctor Image"
            multiple={false}
            maxFiles={1}
            onChange={setDoctorImage}
          />

          {doctorImage && (
            <div className="mt-5">
              <img
                src={URL.createObjectURL(doctorImage)}
                alt="Doctor"
                className="
w-40
h-40
rounded-2xl
object-cover
border
shadow
"
              />

              <p
                className="
text-green-600
font-medium
mt-3
"
              >
                ✓ Image selected successfully
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
