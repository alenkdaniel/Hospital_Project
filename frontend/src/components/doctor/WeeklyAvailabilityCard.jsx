const WeeklyAvailabilityCard = ({
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
space-y-8
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
          Weekly Availability
        </h2>

        <p
          className="
text-gray-500
mt-2
"
        >
          Configure the doctor's working days and consultation timings.
        </p>
      </div>

      <div
        className="
grid
grid-cols-1
md:grid-cols-3
gap-6
"
      >
        {/* Working Days */}

        <div className="md:col-span-3">

          <label
            className="
block
text-sm
font-semibold
text-gray-700
mb-2
"
          >
            Working Days
          </label>

          <input
            type="text"
            name="availableDays"
            value={form.availableDays}
            onChange={handleChange}
            placeholder="Monday,Wednesday,Friday"
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

          <p
            className="
text-xs
text-gray-500
mt-2
"
          >
            Separate multiple days using commas.
          </p>

        </div>

        {/* Start */}

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
            Start Time
          </label>

          <input
            type="time"
            name="start"
            value={form.start}
            onChange={handleChange}
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

        {/* End */}

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
            End Time
          </label>

          <input
            type="time"
            name="end"
            value={form.end}
            onChange={handleChange}
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

        {/* Slot */}

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
            Slot Duration
          </label>

          <div
            className="
h-[50px]
rounded-xl
border
border-gray-300
bg-gray-50
flex
items-center
justify-center
font-semibold
text-blue-600
"
          >
            10 Minutes
          </div>

        </div>

      </div>
    </div>
  );
};

export default WeeklyAvailabilityCard;