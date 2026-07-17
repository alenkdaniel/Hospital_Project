import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const specialists = [
  {
    id: 1,
    name: "Dr. James Wilson",
    specialty: "Cardiologist",
    experience: "Heart and cardiovascular treatments with 15+ years of experience.",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1200&auto=format&fit=crop",
  },

  {
    id: 2,
    name: "Dr. Sarah Chen",
    specialty: "Neurologist",
    experience:
      "Specialized brain and nervous system care for neurological conditions.",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1200&auto=format&fit=crop",
  },

  {
    id: 3,
    name: "Dr. Robert Fox",
    specialty: "Pediatrician",
    experience:
      "Comprehensive healthcare for children and adolescents.",
    image:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=1200&auto=format&fit=crop",
  },

  {
    id: 4,
    name: "Dr. Emily Blunt",
    specialty: "Dentist",
    experience:
      "Expert dental and oral treatments using modern painless technology.",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=1200&auto=format&fit=crop",
  },
];

const Specialists = () => {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold text-slate-900">
            Medical Specialists
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg text-gray-500">
            Our team of world-class specialists is dedicated to your health
            across every medical discipline.
          </p>
        </motion.div>

        {/* Cards */}

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {specialists.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
              }}
              viewport={{ once: true }}
              className="group overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Image */}

              <div className="overflow-hidden">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="h-72 w-full object-cover transition duration-500 group-hover:scale-110"
                />
              </div>

              {/* Content */}

              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-900">
                  {doctor.name}
                </h3>

                <p className="mt-2 font-semibold text-blue-600">
                  {doctor.specialty}
                </p>

                <p className="mt-4 text-gray-500 leading-7">
                  {doctor.experience}
                </p>

                <Link
                  to={`/doctors?specialty=${doctor.specialty}`}
                  className="mt-6 inline-flex items-center font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  View Specialist →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Button */}

        <div className="mt-16 text-center">
          <Link
            to="/doctors"
            className="inline-flex items-center rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
          >
            View All Doctors
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Specialists;