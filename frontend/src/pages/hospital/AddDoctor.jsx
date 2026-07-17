import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { createDoctor, resetDoctor } from "../../features/doctor/doctorSlice";

import toast from "react-hot-toast";
import DoctorHeader from "../../components/doctor/DoctorHeader";
import BasicInformationCard from "../../components/doctor/BasicInformationCard";
import ContactCard from "../../components/doctor/ContactCard";
import WeeklyAvailabilityCard from "../../components/doctor/WeeklyAvailabilityCard";
import AboutCard from "../../components/doctor/AboutCard";

const AddDoctor = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const {
    isLoading,

    isSuccess,

    isError,

    message,
  } = useSelector((state) => state.doctor);

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
      .map(day => day.trim())
      .filter(Boolean);

    days.forEach((day, index) => {
      formData.append(`weeklySchedule[${index}][day]`, day);
      formData.append(`weeklySchedule[${index}][isWorking]`, true);
      formData.append(`weeklySchedule[${index}][startTime]`, form.start);
      formData.append(`weeklySchedule[${index}][endTime]`, form.end);
      formData.append(`weeklySchedule[${index}][slotDuration]`, 10);
    });

    formData.append("doctorImage", doctorImage);

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

    if (!doctorImage) {
      toast.error("Upload doctor image");
      return;
    }

    try {
      await dispatch(createDoctor(buildDoctorFormData())).unwrap();
      for (const [key, value] of buildDoctorFormData().entries()) {
  console.log(key, value);
}
    } catch (error) {
      console.error(error);
      toast.error(error || "Failed to create doctor");
    }
  };

  // =================================
  // SUCCESS ERROR
  // =================================

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      toast.success("Doctor added successfully");

      navigate("/hospital-admin");
    }

    return () => {
      dispatch(resetDoctor());
    };
  }, [isSuccess, isError, message, dispatch, navigate]);

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
"
      >
        <DoctorHeader
          isLoading={isLoading}
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

export default AddDoctor;
