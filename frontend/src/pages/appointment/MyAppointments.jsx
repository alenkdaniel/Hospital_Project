import { useEffect, useMemo, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import {
  getMyAppointments,
  resetAppointment,
} from "../../features/appointment/appointmentSlice";

import { motion, AnimatePresence } from "framer-motion";

import toast from "react-hot-toast";

import {
  CalendarDays,
  Stethoscope,
  Building2,
  Clock,
  Hourglass,
  CreditCard,
  CheckCircle2,
  XCircle,
  Star,
  ArrowRight,
  CalendarPlus,
  Ticket,
} from "lucide-react";

import ReviewModal from "../../components/ReviewModal";

// ======================================
// STATUS PRESENTATION
// ======================================

const STATUS_STYLES = {
  confirmed: {
    label: "Confirmed",
    dot: "bg-brand-500",
    badge: "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200",
  },
  pending: {
    label: "Pending",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  },
  completed: {
    label: "Completed",
    dot: "bg-ink-500",
    badge: "bg-ink-100 text-ink-700 ring-1 ring-inset ring-ink-200",
  },
  cancelled: {
    label: "Cancelled",
    dot: "bg-rose-500",
    badge: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
  },
};

const getStatusStyle = (status) =>
  STATUS_STYLES[status] || {
    label: status || "Unknown",
    dot: "bg-ink-400",
    badge: "bg-ink-100 text-ink-600 ring-1 ring-inset ring-ink-200",
  };

const TABS = [
  { key: "all", label: "All" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

const MyAppointments = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [reviewTarget, setReviewTarget] = useState(null);

  const [activeTab, setActiveTab] = useState("all");

  const {
    appointments,

    isLoading,

    isError,

    message,
  } = useSelector((state) => state.appointment);

  // ======================================
  // LOAD APPOINTMENTS
  // ======================================

  useEffect(() => {
    dispatch(getMyAppointments());

    return () => {
      dispatch(resetAppointment());
    };
  }, [dispatch]);

  // ======================================
  // ERROR
  // ======================================

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  // ======================================
  // FILTERED LIST
  // ======================================

  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];

    if (activeTab === "all") return appointments;

    if (activeTab === "upcoming") {
      return appointments.filter(
        (item) => item.status === "confirmed" || item.status === "pending",
      );
    }

    return appointments.filter((item) => item.status === activeTab);
  }, [appointments, activeTab]);

  return (
    <div className="min-h-screen bg-ink-50 pt-28 px-6 pb-20 md:px-24">
      {/* HEADER */}

      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 p-10 text-white shadow-lg md:p-12">
        {/* decorative ring */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-24 right-16 h-72 w-72 rounded-full bg-white/5" />

        <div className="relative flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
            <CalendarDays size={24} />
          </span>
          <h1 className="text-3xl font-extrabold md:text-4xl">
            My Appointments
          </h1>
        </div>

        <p className="relative mt-4 max-w-xl text-brand-50/90">
          Track your hospital visits, doctors and payment status in one
          place.
        </p>
      </div>

      {/* TABS */}

      <div className="relative mt-8 flex w-fit gap-1 rounded-2xl border border-ink-100 bg-white p-1.5 shadow-sm">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? "text-white"
                  : "text-ink-500 hover:text-ink-800"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="appointments-tab-pill"
                  className="absolute inset-0 rounded-xl bg-brand-700"
                  transition={{ type: "spring", duration: 0.4 }}
                />
              )}
              <span className="relative">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* LOADING */}

      {isLoading && (
        <div className="mt-10 space-y-6">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="h-40 animate-pulse rounded-[28px] border border-ink-100 bg-white"
            />
          ))}
        </div>
      )}

      {/* EMPTY */}

      {!isLoading && filteredAppointments.length === 0 && (
        <div className="mt-10 flex flex-col items-center rounded-[28px] border border-dashed border-ink-200 bg-white px-6 py-20 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
            <Ticket size={28} className="text-brand-600" />
          </span>
          <h3 className="mt-5 text-xl font-bold text-ink-900">
            {activeTab === "all"
              ? "No appointments yet"
              : `No ${activeTab} appointments`}
          </h3>
          <p className="mt-2 max-w-sm text-ink-500">
            When you book a visit with a doctor, it will show up here as a
            ticket you can track.
          </p>
          <Link
            to="/hospitals"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-brand-700 px-6 py-3 font-semibold text-white transition hover:bg-brand-800"
          >
            <CalendarPlus size={18} />
            Book an appointment
          </Link>
        </div>
      )}

      {/* LIST */}

      <div className="mt-8 space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredAppointments.map((item) => {
            const status = getStatusStyle(item.status);
            const isPaid = item.payment?.status === "paid";

            return (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="group relative flex flex-col overflow-hidden rounded-[28px] border border-ink-100 bg-white shadow-sm transition-shadow hover:shadow-lg md:flex-row"
              >
                {/* ticket notches on the outer edges, desktop only */}
                <span className="pointer-events-none absolute left-0 top-1/2 hidden h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink-50 md:block" />
                <span className="pointer-events-none absolute right-0 top-1/2 hidden h-5 w-5 translate-x-1/2 -translate-y-1/2 rounded-full bg-ink-50 md:block" />

                {/* MAIN DETAILS */}

                <div className="grid flex-1 gap-6 p-6 sm:grid-cols-2 md:p-8 lg:grid-cols-3">
                  {/* DOCTOR */}

                  <div>
                    <div className="flex items-center gap-2 text-ink-400">
                      <Stethoscope size={16} />
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        Doctor
                      </span>
                    </div>
                    <h2 className="mt-2 text-lg font-bold text-ink-900">
                      Dr. {item.doctor?.name}
                    </h2>
                    <p className="mt-1 font-medium text-brand-700">
                      {item.doctor?.specialization}
                    </p>
                  </div>

                  {/* HOSPITAL */}

                  <div>
                    <div className="flex items-center gap-2 text-ink-400">
                      <Building2 size={16} />
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        Hospital
                      </span>
                    </div>
                    <p className="mt-2 font-semibold text-ink-900">
                      {item.hospital?.name}
                    </p>
                    <p className="mt-1 text-sm text-ink-500">
                      Appt No: {item.booking?.appointmentNumber}
                    </p>
                  </div>

                  {/* DATE / TIME / QUEUE */}

                  <div className="space-y-2 text-sm text-ink-600">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} className="text-ink-400" />
                      {new Date(item.appointmentDate).toLocaleDateString(
                        undefined,
                        { day: "numeric", month: "short", year: "numeric" },
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-ink-400" />
                      {item.slot?.start} - {item.slot?.end}
                    </div>
                    {item.queue?.estimatedWaitingTime !== undefined && (
                      <div className="flex items-center gap-2">
                        <Hourglass size={16} className="text-ink-400" />
                        ~{item.queue?.estimatedWaitingTime} mins wait
                      </div>
                    )}
                  </div>
                </div>

                {/* dashed divider, desktop only */}
                <div className="hidden border-l-2 border-dashed border-ink-200 md:block" />

                {/* STUB / STATUS */}

                <div className="flex w-full flex-col justify-center gap-4 bg-ink-50/70 p-6 md:w-72 md:p-8">
                  {item.queue?.tokenNumber && (
                    <div className="text-center">
                      <p className="text-xs font-semibold uppercase tracking-widest text-ink-400">
                        Token
                      </p>
                      <p className="font-display text-3xl font-extrabold text-ink-900">
                        #{item.queue?.tokenNumber}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${status.badge}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                      {status.label}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                        isPaid
                          ? "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200"
                          : "bg-ink-100 text-ink-600 ring-1 ring-inset ring-ink-200"
                      }`}
                    >
                      <CreditCard size={13} />
                      {item.payment?.status || "unpaid"}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate(`/appointments/${item._id}`)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-700 py-3 font-semibold text-white transition hover:bg-brand-800"
                  >
                    View Details
                    <ArrowRight size={16} />
                  </button>

                  {item.status === "completed" && !item.isReviewed && (
                    <button
                      onClick={() => setReviewTarget(item)}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 py-3 font-semibold text-amber-950 transition hover:bg-amber-500"
                    >
                      <Star size={16} />
                      Leave a Review
                    </button>
                  )}

                  {item.status === "completed" && item.isReviewed && (
                    <p className="flex items-center justify-center gap-1.5 text-center text-sm font-medium text-brand-700">
                      <CheckCircle2 size={16} />
                      Review submitted
                    </p>
                  )}

                  {item.status === "cancelled" && (
                    <p className="flex items-center justify-center gap-1.5 text-center text-sm font-medium text-rose-600">
                      <XCircle size={16} />
                      This visit was cancelled
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {reviewTarget && (
        <ReviewModal
          appointment={reviewTarget}
          onClose={() => setReviewTarget(null)}
        />
      )}
    </div>
  );
};

export default MyAppointments;