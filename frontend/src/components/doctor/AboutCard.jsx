const AboutCard = ({
  form,
  handleChange,
}) => {
  return (
    <div
      className="
bg-white
rounded-3xl
border
border-gray-200
shadow-sm
p-8
space-y-6
"
    >
      {/* Header */}

      <div>
        <h2
          className="
text-2xl
font-bold
text-gray-800
"
        >
          About Doctor
        </h2>

        <p
          className="
text-gray-500
mt-2
"
        >
          Write a short professional introduction about the doctor.
        </p>
      </div>

      {/* About */}

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
          Professional Summary
        </label>

        <textarea
          name="about"
          value={form.about}
          onChange={handleChange}
          rows={6}
          placeholder="Example:
Dr. John Doe is an experienced cardiologist with more than 10 years of experience in diagnosing and treating cardiovascular diseases..."
          className="
w-full
border
border-gray-300
rounded-2xl
px-4
py-3
outline-none
resize-none
focus:ring-2
focus:ring-blue-500
"
        />

        <p
          className="
text-xs
text-gray-500
mt-2
"
        >
          A brief description helps patients know more about the doctor's expertise.
        </p>

      </div>
    </div>
  );
};

export default AboutCard;