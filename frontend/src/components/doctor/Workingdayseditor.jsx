import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";

import { motion } from "framer-motion";

import toast from "react-hot-toast";

import { updateMySchedule } from "../../features/doctor/doctorSlice";

// =====================================
// WEEK DAY ORDER (display)
// =====================================

const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// =====================================
// BUILD A FULL 7-DAY SCHEDULE
//
// A doctor's saved weeklySchedule may only
// contain the days that were configured when
// they were added — fill in the rest so every
// day always has a row to edit.
// =====================================

const buildFullWeek = (weeklySchedule = []) => {
  const byDay = {};

  weeklySchedule.forEach((entry) => {
    byDay[entry.day] = entry;
  });

  return DAY_ORDER.map((day) => ({
    day,
    isWorking: byDay[day]?.isWorking ?? false,
    startTime: byDay[day]?.startTime || "09:00",
    endTime: byDay[day]?.endTime || "17:00",
    slotDuration: byDay[day]?.slotDuration ?? 10,
  }));
};

const WorkingDaysEditor = ({ profile, isLoading }) => {
  const dispatch = useDispatch();

  const [days, setDays] = useState(buildFullWeek());

  const [saving, setSaving] = useState(false);

  // =================================
  // SYNC LOCAL STATE FROM PROFILE
  // =================================

  useEffect(() => {
    if (profile) {
      setDays(buildFullWeek(profile.weeklySchedule));
    }
  }, [profile]);

  // =================================
  // HANDLERS
  // =================================

  const toggleDay = (day) => {
    setDays((prev) =>
      prev.map((d) =>
        d.day === day ? { ...d, isWorking: !d.isWorking } : d,
      ),
    );
  };

  const updateTime = (day, field, value) => {
    setDays((prev) =>
      prev.map((d) => (d.day === day ? { ...d, [field]: value } : d)),
    );
  };

  const validate = () => {
    const working = days.filter((d) => d.isWorking);

    if (working.length === 0) {
      toast.error("Select at least one working day");
      return false;
    }

    for (const d of working) {
      if (!d.startTime || !d.endTime) {
        toast.error(`Please set a start and end time for ${d.day}`);
        return false;
      }

      if (d.startTime >= d.endTime) {
        toast.error(`${d.day}: start time must be before end time`);
        return false;
      }
    }

    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSaving(true);

    try {
      await dispatch(updateMySchedule(days)).unwrap();

      toast.success("Working days updated");
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : "Failed to update working days",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.form
      onSubmit={submitHandler}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="
bg-white
rounded-3xl
shadow-lg
p-8
mt-10
"
    >
      <div
        className="
flex
flex-col
md:flex-row
md:items-center
md:justify-between
gap-4
mb-8
"
      >
        <div>
          <h2
            className="
text-2xl
font-bold
text-gray-800
"
          >
            🗓️ My Working Days
          </h2>

          <p
            className="
text-gray-500
mt-1
"
          >
            Turn a day on or off and set your consultation hours. Patients
            will only be able to book you on the days you mark as working.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving || isLoading}
          className="
bg-gradient-to-r
from-blue-600
to-cyan-500
text-white
font-semibold
px-6
py-3
rounded-xl
hover:opacity-90
disabled:opacity-50
disabled:cursor-not-allowed
whitespace-nowrap
"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>

      {isLoading && !profile ? (
        <p className="text-gray-500">Loading your schedule...</p>
      ) : (
        <div className="space-y-3">
          {days.map((d) => (
            <div
              key={d.day}
              className={`
grid
grid-cols-1
md:grid-cols-[160px_1fr_1fr]
items-center
gap-4
rounded-2xl
border
p-4
transition-colors
${d.isWorking
                  ? "border-blue-200 bg-blue-50/60"
                  : "border-gray-200 bg-gray-50"
                }
`}
            >
              {/* DAY TOGGLE */}

              <button
                type="button"
                onClick={() => toggleDay(d.day)}
                className="
flex
items-center
gap-3
text-left
"
              >
                <span
                  className={`
relative
inline-flex
h-6
w-11
items-center
rounded-full
transition-colors
${d.isWorking ? "bg-blue-600" : "bg-gray-300"}
`}
                >
                  <span
                    className={`
inline-block
h-4
w-4
transform
rounded-full
bg-white
transition-transform
${d.isWorking ? "translate-x-6" : "translate-x-1"}
`}
                  />
                </span>

                <span
                  className={`
font-semibold
${d.isWorking ? "text-gray-800" : "text-gray-400"}
`}
                >
                  {d.day}
                </span>
              </button>

              {/* START TIME */}

              <div>
                <label
                  className="
block
text-xs
font-semibold
text-gray-500
mb-1
"
                >
                  Start time
                </label>

                <input
                  type="time"
                  value={d.startTime}
                  disabled={!d.isWorking}
                  onChange={(e) =>
                    updateTime(d.day, "startTime", e.target.value)
                  }
                  className="
w-full
border
border-gray-300
rounded-xl
px-3
py-2
outline-none
focus:ring-2
focus:ring-blue-500
disabled:bg-gray-100
disabled:text-gray-400
disabled:cursor-not-allowed
"
                />
              </div>

              {/* END TIME */}

              <div>
                <label
                  className="
block
text-xs
font-semibold
text-gray-500
mb-1
"
                >
                  End time
                </label>

                <input
                  type="time"
                  value={d.endTime}
                  disabled={!d.isWorking}
                  onChange={(e) =>
                    updateTime(d.day, "endTime", e.target.value)
                  }
                  className="
w-full
border
border-gray-300
rounded-xl
px-3
py-2
outline-none
focus:ring-2
focus:ring-blue-500
disabled:bg-gray-100
disabled:text-gray-400
disabled:cursor-not-allowed
"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.form>
  );
};

export default WorkingDaysEditor;