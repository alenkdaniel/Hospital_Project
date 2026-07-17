import { motion } from "framer-motion";

function About() {
  return (
    <div
      className="
min-h-screen
bg-blue-50
pt-28
"
    >
      {/* HERO */}

      <section className="text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="
text-6xl
font-extrabold
tracking-widest
text-gray-900
"
        >
          Our Care
        </motion.h1>

        <p
          className="
mt-8
text-gray-600
text-lg
max-w-3xl
mx-auto
leading-relaxed
"
        >
          Connecting patients with trusted hospitals, experienced doctors, and
          emergency healthcare services anytime, anywhere.
        </p>
      </section>

      {/* IMAGE AREA */}

      <section
        className="
grid
md:grid-cols-2
gap-10
px-10
md:px-24
mt-20
"
      >
        <img
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1600"
          className="
rounded-[35px]
shadow-xl
h-96
w-full
object-cover
"
        />

        <img
          src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1600"
          className="
rounded-[35px]
shadow-xl
h-96
w-full
object-cover
"
        />
      </section>

      {/* MISSION */}

      <section
        className="
px-10
md:px-24
py-24
grid
md:grid-cols-2
gap-16
items-center
bg-white
mt-24
"
      >
        <div>
          <h2
            className="
text-5xl
font-bold
"
          >
            Our Mission
          </h2>

          <p
            className="
mt-8
text-gray-600
text-lg
leading-relaxed
"
          >
            Our mission is to make healthcare more accessible by connecting
            patients with the right hospitals and doctors. We provide a smart
            platform where users can discover hospitals, view medical
            specialists and access emergency services easily.
          </p>
        </div>

        <div
          className="
bg-blue-600
text-white
rounded-[40px]
p-14
shadow-xl
"
        >
          <h3
            className="
text-4xl
font-bold
"
          >
            Better Healthcare
          </h3>

          <p className="mt-6">
            A digital bridge between patients and medical professionals.
          </p>
        </div>
      </section>

      {/* STATS */}

      <section
        className="
px-10
md:px-24
py-24
"
      >
        <div
          className="
grid
md:grid-cols-4
gap-10
"
        >
          {[
            ["🏥", "500+", "Hospitals"],

            ["👨‍⚕️", "1000+", "Doctors"],

            ["😊", "20K+", "Patients"],

            ["🚑", "24/7", "Emergency"],
          ].map((item, index) => (
            <div
              key={index}
              className="
bg-white
rounded-3xl
shadow-xl
p-10
text-center
"
            >
              <div className="text-5xl">{item[0]}</div>

              <h2
                className="
text-4xl
font-bold
text-blue-600
mt-5
"
              >
                {item[1]}
              </h2>

              <p className="text-gray-500 mt-2">{item[2]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VALUES */}

      <section
        className="
bg-white
px-10
md:px-24
py-24
"
      >
        <h2
          className="
text-center
text-5xl
font-bold
"
        >
          Our Values
        </h2>

        <div
          className="
grid
md:grid-cols-3
gap-10
mt-16
"
        >
          {[
            [
              "❤️",
              "Patient First",
              "Every decision focuses on better patient experience.",
            ],

            [
              "🔒",
              "Trusted Care",
              "Verified hospitals and secure healthcare access.",
            ],

            [
              "⚡",
              "Fast Support",
              "Quick access to medical information anytime.",
            ],
          ].map((item, index) => (
            <div
              key={index}
              className="
rounded-3xl
shadow-xl
p-10
"
            >
              <div className="text-5xl">{item[0]}</div>

              <h3
                className="
text-2xl
font-bold
mt-5
"
              >
                {item[1]}
              </h3>

              <p
                className="
text-gray-500
mt-4
"
              >
                {item[2]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* TECHNOLOGY */}

      <section
        className="
px-10
md:px-24
py-24
grid
md:grid-cols-2
gap-16
items-center
"
      >
        <img
          src="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=1200"
          alt="Healthcare Technology"
          className="
rounded-[40px]
shadow-xl
w-full
h-[420px]
object-cover
"
        />

        <div>
          <h2
            className="
text-5xl
font-bold
"
          >
            Smart Healthcare Technology
          </h2>

          <p
            className="
mt-8
text-gray-600
leading-relaxed
text-lg
"
          >
            Our system uses modern digital solutions to manage hospitals,
            doctors, appointments and patient healthcare information.
          </p>
        </div>
      </section>
    </div>
  );
}

export default About;
