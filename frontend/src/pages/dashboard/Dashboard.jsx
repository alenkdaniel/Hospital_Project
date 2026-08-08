import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  CalendarClock,
  CalendarPlus,
  Building2,
  Siren,
  Bell,
  Droplet,
  ShieldAlert,
  Phone,
  ChevronRight,
  Stethoscope,
  MapPin,
  Star,
  Sparkles,
  ClipboardList,
  CircleUserRound,
} from "lucide-react";

import { getMyAppointments } from "../../features/appointment/appointmentSlice";
import { fetchNotifications } from "../../features/notification/notificationSlice";

// =====================================
// STATIC CONFIG
// =====================================

const ACTIVE_STATUSES = ["pending", "confirmed", "checked_in", "in_consultation"];

const STATUS_CONFIG = {
  pending: { label: "Pending", chip: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20", dot: "bg-amber-500" },
  confirmed: { label: "Confirmed", chip: "bg-sky-50 text-sky-700 ring-1 ring-sky-600/20", dot: "bg-sky-500" },
  checked_in: { label: "Checked In", chip: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20", dot: "bg-indigo-500" },
  in_consultation: { label: "In Consultation", chip: "bg-violet-50 text-violet-700 ring-1 ring-violet-600/20", dot: "bg-violet-500" },
  completed: { label: "Completed", chip: "bg-brand-50 text-brand-700 ring-1 ring-brand-600/20", dot: "bg-brand-500" },
  cancelled: { label: "Cancelled", chip: "bg-rose-50 text-rose-700 ring-1 ring-rose-600/20", dot: "bg-rose-500" },
  rejected: { label: "Rejected", chip: "bg-rose-50 text-rose-700 ring-1 ring-rose-600/20", dot: "bg-rose-500" },
  no_show: { label: "No Show", chip: "bg-ink-100 text-ink-600 ring-1 ring-ink-400/20", dot: "bg-ink-400" },
};

// =====================================
// HELPERS
// =====================================

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "P";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 5) return "Good night";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

const formatSlot = (time) => {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
};

const relativeDay = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target - today) / 86400000);

  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff > 1 && diff < 7) return `In ${diff} days`;
  return formatDate(date);
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.06, ease: "easeOut" },
  }),
};

// =====================================
// COMPONENT
// =====================================

const Dashboard = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { appointments, isLoading } = useSelector((state) => state.appointment);
  const { notifications, unreadCount } = useSelector((state) => state.notification);

  useEffect(() => {
    dispatch(getMyAppointments());
    dispatch(fetchNotifications({ page: 1, limit: 5 }));
  }, [dispatch]);

  const { nextAppointment, recentAppointments, upcomingCount, completedCount, reviewCount } =
    useMemo(() => {
      const list = [...(appointments || [])];

      const upcoming = list
        .filter(
          (a) =>
            ACTIVE_STATUSES.includes(a.status) &&
            new Date(a.appointmentDate).setHours(0, 0, 0, 0) >=
              new Date().setHours(0, 0, 0, 0),
        )
        .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

      const next = upcoming[0] || null;

      const recent = list
        .filter((a) => a._id !== next?._id)
        .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
        .slice(0, 5);

      return {
        nextAppointment: next,
        recentAppointments: recent,
        upcomingCount: list.filter((a) => ACTIVE_STATUSES.includes(a.status)).length,
        completedCount: list.filter((a) => a.status === "completed").length,
        reviewCount: list.filter((a) => a.status === "completed" && !a.isReviewed).length,
      };
    }, [appointments]);

  const stats = [
    { label: "Upcoming Visits", value: upcomingCount, icon: CalendarClock, tint: "text-sky-600 bg-sky-50" },
    { label: "Completed Visits", value: completedCount, icon: Stethoscope, tint: "text-brand-600 bg-brand-50" },
    { label: "Unread Alerts", value: unreadCount || 0, icon: Bell, tint: "text-amber-600 bg-amber-50" },
    { label: "Reviews Pending", value: reviewCount, icon: Star, tint: "text-violet-600 bg-violet-50" },
  ];

  const quickActions = [
    { label: "Book Appointment", to: "/doctors", icon: CalendarPlus, tint: "from-brand-500 to-brand-700" },
    { label: "Find Hospitals", to: "/hospitals", icon: Building2, tint: "from-sky-500 to-sky-700" },
    { label: "My Appointments", to: "/my", icon: ClipboardList, tint: "from-violet-500 to-violet-700" },
    { label: "Emergency Care", to: "/hospitals", icon: Siren, tint: "from-rose-500 to-rose-700" },
  ];

  return (
    <div className="min-h-screen bg-ink-50 pt-28 px-4 sm:px-6 lg:px-10 pb-16">
      <div className="max-w-7xl mx-auto">
        {/* ============ HERO ============ */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-600 to-ink-900 p-8 sm:p-10 text-white shadow-xl"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />

          <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium tracking-wide backdrop-blur-sm">
                <Sparkles size={13} />
                {user?.opNumber || "Patient Portal"}
              </span>

              <h1 className="mt-4 text-3xl sm:text-4xl font-bold">
                {getGreeting()}, {user?.name?.split(" ")[0] || "there"} 👋
              </h1>

              <p className="mt-3 max-w-xl text-brand-50/90 text-base sm:text-lg">
                Here's what's happening with your care today.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/doctors"
                className="inline-flex items-center gap-2 rounded-xl bg-white text-brand-700 px-5 py-3 font-semibold shadow-lg hover:bg-brand-50 transition-colors"
              >
                <CalendarPlus size={18} />
                Book Appointment
              </Link>
              <Link
                to="/my"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 font-semibold ring-1 ring-white/30 backdrop-blur-sm hover:bg-white/20 transition-colors"
              >
                View Appointments
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ============ STATS ============ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="bg-white rounded-2xl shadow-sm ring-1 ring-ink-200/70 p-5 flex items-center gap-4"
            >
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${s.tint}`}>
                <s.icon size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-ink-900 leading-none">{s.value}</p>
                <p className="text-xs text-ink-500 mt-1.5 truncate">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ============ QUICK ACTIONS ============ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {quickActions.map((a, i) => (
            <motion.div key={a.label} custom={i} variants={fadeUp} initial="hidden" animate="show">
              <Link
                to={a.to}
                className={`group relative overflow-hidden flex items-center gap-3 rounded-2xl bg-gradient-to-br ${a.tint} text-white p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all`}
              >
                <a.icon size={20} className="shrink-0" />
                <span className="text-sm font-semibold">{a.label}</span>
                <ChevronRight
                  size={16}
                  className="ml-auto opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0"
                />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ============ MAIN GRID ============ */}
        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          {/* ---------- LEFT COLUMN ---------- */}
          <div className="lg:col-span-2 space-y-6">
            {/* Next appointment spotlight */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="bg-white rounded-3xl shadow-sm ring-1 ring-ink-200/70 p-6 sm:p-7"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-ink-900">Next Appointment</h2>
                {nextAppointment && (
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_CONFIG[nextAppointment.status]?.chip}`}>
                    {STATUS_CONFIG[nextAppointment.status]?.label}
                  </span>
                )}
              </div>

              {isLoading && !nextAppointment ? (
                <div className="animate-pulse h-28 rounded-2xl bg-ink-100" />
              ) : nextAppointment ? (
                <Link
                  to={`/appointments/${nextAppointment._id}`}
                  className="flex flex-col sm:flex-row gap-5 rounded-2xl border border-ink-200 p-5 hover:border-brand-300 hover:bg-brand-50/30 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="h-14 w-14 shrink-0 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-lg overflow-hidden">
                      {nextAppointment.doctor?.image ? (
                        <img
                          src={nextAppointment.doctor.image}
                          alt={nextAppointment.doctor?.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        getInitials(nextAppointment.doctor?.name)
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-ink-900 truncate">
                        Dr. {nextAppointment.doctor?.name || "Doctor"}
                      </p>
                      <p className="text-sm text-ink-500 truncate">
                        {nextAppointment.doctor?.specialization || "General Physician"}
                      </p>
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-ink-500 truncate">
                        <MapPin size={12} className="shrink-0" />
                        {nextAppointment.hospital?.name}
                        {nextAppointment.hospital?.address?.city
                          ? `, ${nextAppointment.hospital.address.city}`
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col justify-between sm:justify-center sm:items-end gap-1 sm:border-l sm:border-ink-200 sm:pl-5 shrink-0">
                    <span className="text-sm font-bold text-brand-700">
                      {relativeDay(nextAppointment.appointmentDate)}
                    </span>
                    <span className="text-sm text-ink-500">
                      {formatSlot(nextAppointment.slot?.start)}
                    </span>
                  </div>
                </Link>
              ) : (
                <div className="text-center py-10 rounded-2xl border border-dashed border-ink-200">
                  <CalendarClock className="mx-auto text-ink-300" size={34} />
                  <p className="mt-3 text-ink-500">No upcoming appointments scheduled.</p>
                  <Link
                    to="/doctors"
                    className="inline-flex items-center gap-1.5 mt-4 text-brand-700 font-semibold text-sm hover:underline"
                  >
                    Book your next visit <ChevronRight size={14} />
                  </Link>
                </div>
              )}
            </motion.div>

            {/* Recent appointments */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="bg-white rounded-3xl shadow-sm ring-1 ring-ink-200/70 p-6 sm:p-7"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-ink-900">Appointment History</h2>
                <Link to="/my" className="text-sm font-semibold text-brand-700 hover:underline flex items-center gap-1">
                  View all <ChevronRight size={14} />
                </Link>
              </div>

              {recentAppointments.length > 0 ? (
                <ul className="divide-y divide-ink-100">
                  {recentAppointments.map((appt) => (
                    <li key={appt._id}>
                      <Link
                        to={`/appointments/${appt._id}`}
                        className="flex items-center gap-4 py-4 group"
                      >
                        <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${STATUS_CONFIG[appt.status]?.dot}`} />

                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-ink-900 truncate group-hover:text-brand-700 transition-colors">
                            Dr. {appt.doctor?.name || "Doctor"}
                            <span className="text-ink-400 font-normal"> · {appt.doctor?.specialization}</span>
                          </p>
                          <p className="text-xs text-ink-500 mt-0.5">
                            {formatDate(appt.appointmentDate)} · {formatSlot(appt.slot?.start)}
                          </p>
                        </div>

                        <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_CONFIG[appt.status]?.chip}`}>
                          {STATUS_CONFIG[appt.status]?.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                !isLoading && (
                  <p className="text-center text-ink-400 py-10 text-sm">
                    Your appointment history will show up here.
                  </p>
                )
              )}
            </motion.div>
          </div>

          {/* ---------- RIGHT COLUMN ---------- */}
          <div className="space-y-6">
            {/* Patient ID card — signature element */}
            <motion.div variants={fadeUp} initial="hidden" animate="show">
              <div className="id-card-shine relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 via-ink-900 to-brand-900 text-white p-6 shadow-xl">
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(135deg, white 0, white 1px, transparent 1px, transparent 14px)",
                  }}
                />

                <div className="relative flex items-center justify-between">
                  <span className="text-[11px] font-semibold tracking-[0.2em] text-brand-200 uppercase">
                    Patient ID
                  </span>
                  <span className="h-6 w-9 rounded-md bg-gradient-to-br from-brand-300 to-brand-500 opacity-90" />
                </div>

                <div className="relative flex items-center gap-4 mt-6">
                  <div className="h-16 w-16 shrink-0 rounded-2xl bg-white/10 ring-1 ring-white/20 flex items-center justify-center text-xl font-bold overflow-hidden">
                    {user?.image ? (
                      <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      getInitials(user?.name)
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-lg truncate">{user?.name}</p>
                    <p className="text-sm text-brand-100/80 font-mono tracking-wide truncate">
                      {user?.opNumber || "—"}
                    </p>
                  </div>
                </div>

                <div className="relative grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-white/10 text-sm">
                  <div>
                    <p className="text-[11px] text-brand-100/60 uppercase tracking-wide">Blood Group</p>
                    <p className="font-semibold mt-0.5">{user?.medicalProfile?.bloodGroup || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-brand-100/60 uppercase tracking-wide">Gender</p>
                    <p className="font-semibold mt-0.5 capitalize">{user?.gender || "Not set"}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Health snapshot */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="bg-white rounded-3xl shadow-sm ring-1 ring-ink-200/70 p-6"
            >
              <h2 className="text-base font-bold text-ink-900 mb-4 flex items-center gap-2">
                <Droplet size={16} className="text-rose-500" />
                Health Snapshot
              </h2>

              <div className="space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <ShieldAlert size={15} className="text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-ink-500">Allergies: </span>
                    {user?.medicalProfile?.allergies?.length ? (
                      <span className="text-ink-800 font-medium">
                        {user.medicalProfile.allergies.join(", ")}
                      </span>
                    ) : (
                      <span className="text-ink-400">None recorded</span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <Phone size={15} className="text-sky-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-ink-500">Emergency contact: </span>
                    <span className="text-ink-800 font-medium">
                      {user?.medicalProfile?.emergencyContact || "Not set"}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to="/profile"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
              >
                Update medical profile <ChevronRight size={14} />
              </Link>
            </motion.div>

            {/* Notifications preview */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="bg-white rounded-3xl shadow-sm ring-1 ring-ink-200/70 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-ink-900 flex items-center gap-2">
                  <Bell size={16} className="text-brand-600" />
                  Recent Alerts
                </h2>
                {unreadCount > 0 && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700">
                    {unreadCount} new
                  </span>
                )}
              </div>

              {notifications?.length > 0 ? (
                <ul className="space-y-3">
                  {notifications.slice(0, 4).map((n) => (
                    <li key={n._id} className="flex items-start gap-2.5 text-sm">
                      <span
                        className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${
                          n.isRead ? "bg-ink-200" : "bg-brand-500"
                        }`}
                      />
                      <div className="min-w-0">
                        <p className={`truncate ${n.isRead ? "text-ink-500" : "text-ink-900 font-medium"}`}>
                          {n.title}
                        </p>
                        <p className="text-xs text-ink-400 truncate">{n.message}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-ink-400 py-6 text-sm">You're all caught up.</p>
              )}
            </motion.div>

            {/* Profile shortcut */}
            <motion.div variants={fadeUp} initial="hidden" animate="show">
              <Link
                to="/profile"
                className="flex items-center gap-3 rounded-2xl bg-white ring-1 ring-ink-200/70 shadow-sm p-4 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <CircleUserRound size={22} className="text-ink-400" />
                <span className="text-sm font-semibold text-ink-700">View Full Profile</span>
                <ChevronRight size={16} className="ml-auto text-ink-400" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;