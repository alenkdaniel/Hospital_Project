import { useState, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { useDispatch } from "react-redux";

import {
  getDoctorById,
  updateDoctor,
  resetDoctor,
} from "../../features/doctor/doctorSlice";

import toast from "react-hot-toast";
import DoctorHeader from "../../components/doctor/DoctorHeader";
import BasicInformationCard from "../../components/doctor/BasicInformationCard";
import ContactCard from "../../components/doctor/ContactCard";
import WeeklyAvailabilityCard from "../../components/doctor/WeeklyAvailabilityCard";
import AboutCard from "../../components/doctor/AboutCard";

const EditDoctor = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { id } = useParams();

  // Local, page-only flags — kept separate from the shared
  // doctor slice isLoading/isSuccess/isError, since those are
  // reused by getDoctorById, createDoctor AND updateDoctor.
  // Using dispatch(...).unwrap() below gives each action its
  // own unambiguous result instead of relying on those.

  const [pageLoading, setPageLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [existingImage, setExistingImage] = useState("");

  const [form, setForm] = useState({
    name: "",

    gender: "",

    department: "",

    specialization: "",

    qualification: "",

    licenseNumber: "",

    experience: "",

    email: "",

    phone: "",

    consultationFee: "",

    availableDays: "",

    start: "09:00",

    end: "17:00",

    about: "",
  });

  const [doctorImage, setDoctorImage] = useState(null);

  // =================================
  // PREFILL FORM FROM A LOADED DOCTOR
  // =================================

  const prefillForm = (doc) => {
    const workingSchedule = (doc.weeklySchedule || []).filter(
      (s) => s.isWorking === true || s.isWorking === "true",
    );

    setForm({
      name: doc.name || "",

      gender: doc.gender || "",

      department: doc.department || "",

      specialization: doc.specialization || "",

      qualification: doc.qualification || "",

      licenseNumber: doc.licenseNumber || "",

      experience: doc.experience ?? "",

      email: doc.contact?.email || "",

      phone: doc.contact?.phone || "",

      consultationFee: doc.consultationFee ?? "",

      availableDays: workingSchedule.map((s) => s.day).join(","),

      start: workingSchedule[0]?.startTime || "09:00",

      end: workingSchedule[0]?.endTime || "17:00",

      about: doc.about || "",
    });

    setExistingImage(doc.image || "");
  };

  // =================================
  // LOAD EXISTING DOCTOR
  // =================================

  useEffect(() => {
    let cancelled = false;

    const loadDoctor = async () => {
      try {
        const data = await dispatch(getDoctorById(id)).unwrap();

        if (cancelled) return;

        prefillForm(data);
      } catch (error) {
        if (cancelled) return;

        toast.error(error || "Failed to load doctor");

        navigate("/hospital-admin");
      } finally {
        if (!cancelled) setPageLoading(false);
      }
    };

    loadDoctor();

    return () => {
      cancelled = true;

      dispatch(resetDoctor());
    };
  }, [dispatch, id]); // eslint-disable-line react-hooks/exhaustive-deps

  // =================================
  // HANDLE CHANGE
  // =================================

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  const buildDoctorFormData = () => {
    const formData = new FormData();

    // Basic Information
    formData.append("name", form.name);
    formData.append("gender", form.gender);
    formData.append("department", form.department);
    formData.append("licenseNumber", form.licenseNumber);
    formData.append("specialization", form.specialization);
    formData.append("qualification", form.qualification);
    formData.append("experience", Number(form.experience));
    formData.append("consultationFee", Number(form.consultationFee));
    formData.append("about", form.about);

    // Contact
    formData.append("contact[email]", form.email);
    formData.append("contact[phone]", form.phone);

    // Weekly Schedule
    const days = form.availableDays
      .split(",")
      .map((day) => day.trim())
      .filter(Boolean);

    days.forEach((day, index) => {
      formData.append(`weeklySchedule[${index}][day]`, day);
      formData.append(`weeklySchedule[${index}][isWorking]`, true);
      formData.append(`weeklySchedule[${index}][startTime]`, form.start);
      formData.append(`weeklySchedule[${index}][endTime]`, form.end);
      formData.append(`weeklySchedule[${index}][slotDuration]`, 10);
    });

    // Only attach a new image if the admin actually picked one —
    // omitting it leaves the doctor's existing Cloudinary image
    // exactly as it is.
    if (doctorImage) {
      formData.append("doctorImage", doctorImage);
    }

    return formData;
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error("Doctor name is required");
      return false;
    }

    if (!form.gender) {
      toast.error("Please select gender");
      return false;
    }

    if (!form.department) {
      toast.error("Please select department");
      return false;
    }

    if (!form.specialization.trim()) {
      toast.error("Specialization is required");
      return false;
    }

    if (!form.qualification.trim()) {
      toast.error("Qualification is required");
      return false;
    }

    if (!form.licenseNumber.trim()) {
      toast.error("License number is required");
      return false;
    }

    if (!form.experience) {
      toast.error("Experience is required");
      return false;
    }

    if (!form.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    if (!form.phone.trim()) {
      toast.error("Phone number is required");
      return false;
    }

    if (!form.consultationFee) {
      toast.error("Consultation fee is required");
      return false;
    }

    if (!form.availableDays.trim()) {
      toast.error("Please enter available days");
      return false;
    }

    return true;
  };

  // =================================
  // SUBMIT
  // =================================

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const formData = buildDoctorFormData();

      await dispatch(
        updateDoctor({
          id,
          doctorData: formData,
        }),
      ).unwrap();

      toast.success("Doctor updated successfully");

      navigate("/hospital-admin");
    } catch (error) {
      toast.error(error || "Failed to update doctor");
    } finally {
      setSaving(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="pt-32 text-center text-2xl font-bold">
        Loading doctor...
      </div>
    );
  }

  return (
    <div
      className="
min-h-screen
bg-gray-100
pt-28
pb-20
px-6
"
    >
      <form
        onSubmit={submitHandler}
        className="
w-full
max-w-7xl
space-y-8
mx-auto
"
      >
        <DoctorHeader
          isLoading={saving}
          mode="edit"
          onCancel={() => navigate("/hospital-admin")}
        />

        <BasicInformationCard
          form={form}
          handleChange={handleChange}
        />

        <ContactCard
          form={form}
          handleChange={handleChange}
          doctorImage={doctorImage}
          setDoctorImage={setDoctorImage}
          existingImage={existingImage}
        />

        <WeeklyAvailabilityCard
          form={form}
          handleChange={handleChange}
        />

        <AboutCard
          form={form}
          handleChange={handleChange}
        />
      </form>
    </div>
  );
};

export default EditDoctor;