import { useSelector } from "react-redux";

import { motion } from "framer-motion";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div
      className="
min-h-screen
pt-28
px-8
bg-gray-50
"
    >

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="
bg-gradient-to-r
from-blue-600
to-cyan-500
rounded-3xl
p-10
text-white
shadow-xl
"
      >
        <h1
          className="
text-4xl
font-bold
"
        >
          Welcome back, {user?.name} 👋
        </h1>

        <p
          className="
mt-3
text-blue-100
text-lg
"
        >
          Manage your healthcare, hospitals and emergency services.
        </p>
      </motion.div>


      <div
        className="
grid
md:grid-cols-4
gap-8
mt-10
"
      >
        {[
          ["🏥", "Nearby Hospitals", "25 Available"],

          ["👨‍⚕️", "Doctors", "120 Specialists"],

          ["📅", "Appointments", "3 Upcoming"],

          ["🚑", "Emergency", "24/7 Active"],
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{
              y: -8,
            }}
            className="
bg-white
rounded-3xl
shadow-lg
p-8
"
          >
            <div
              className="
text-5xl
"
            >
              {item[0]}
            </div>

            <h2
              className="
mt-5
text-xl
font-bold
"
            >
              {item[1]}
            </h2>

            <p
              className="
text-gray-500
mt-2
"
            >
              {item[2]}
            </p>
          </motion.div>
        ))}
      </div>



      <div
        className="
grid
md:grid-cols-3
gap-10
mt-12
"
      >
        {/* LEFT */}

        <div
          className="
md:col-span-2
bg-white
rounded-3xl
shadow-lg
p-8
"
        >
          <h2
            className="
text-2xl
font-bold
mb-6
"
          >
            Nearby Hospitals
          </h2>

          {[
            "City Care Hospital",

            "Life Line Medical Center",

            "Metro Health Clinic",
          ].map((hospital, index) => (
            <div
              key={index}
              className="
flex
justify-between
items-center
border-b
py-5
"
            >
              <div>
                <h3
                  className="
font-semibold
text-lg
"
                >
                  {hospital}
                </h3>

                <p
                  className="
text-gray-500
"
                >
                  Open now • 2 km away
                </p>
              </div>

              <button
                className="
bg-blue-600
text-white
px-5
py-2
rounded-xl
"
              >
                View
              </button>
            </div>
          ))}
        </div>

        {/* RIGHT PROFILE */}

        <div
          className="
bg-white
rounded-3xl
shadow-lg
p-8
text-center
"
        >
          <div
            className="
mx-auto
w-24
h-24
rounded-full
bg-blue-600
text-white
flex
items-center
justify-center
text-4xl
font-bold
"
          >
            {user?.name?.charAt(0)}
          </div>

          <h2
            className="
mt-5
text-2xl
font-bold
"
          >
            {user?.name}
          </h2>

          <p
            className="
text-gray-500
"
          >
            {user?.email}
          </p>

          <button
            className="
mt-8
w-full
bg-blue-600
text-white
py-3
rounded-xl
"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
