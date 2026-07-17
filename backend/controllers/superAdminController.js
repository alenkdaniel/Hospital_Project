import Hospital from "../models/Hospital.js";

import User from "../models/User.js";

// =================================
// Super Admin Dashboard
// =================================

export const getHospitalsForAdmin = async (req, res) => {
  try {
    const { status } = req.query;

    let filter = {
      isDeleted: false,
    };

    if (status && status !== "all") {
      filter["verification.status"] = status;
    }

    const page = Number(req.query.page) || 1;

    const limit = 5;

    const skip = (page - 1) * limit;

    const hospitals = await Hospital.find(filter)
      .populate("createdBy", "name email")
      .sort({
        createdAt: -1,
        _id: -1,
      })
      .skip(skip)
      .limit(limit);

    const total = await Hospital.countDocuments(filter);

    return res.json({
      success: true,

      hospitals,

      page,

      pages: Math.ceil(total / limit),

      total,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =================================
// APPROVE HOSPITAL
// =================================

export const approveHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({
        message: "Hospital not found",
      });
    }

    // update hospital verification

    hospital.verification.status = "approved";

    hospital.verification.approvedBy = req.user._id;

    hospital.verification.approvedAt = new Date();

    hospital.verification.rejectReason = "";

    await hospital.save();

    // activate hospital admin account

    await User.findByIdAndUpdate(
      hospital.createdBy,

      {
        accountStatus: "active",
      },
    );

    res.json({
      message: "Hospital approved successfully",

      hospital,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =================================
// REJECT HOSPITAL
// =================================

export const rejectHospital = async (req, res) => {
  try {
    const { reason } = req.body;

    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({
        message: "Hospital not found",
      });
    }

    hospital.verification.status = "rejected";

    hospital.verification.rejectReason = reason || "Verification failed";

    await hospital.save();

    // block hospital admin

    await User.findByIdAndUpdate(
      hospital.createdBy,

      {
        accountStatus: "blocked",
      },
    );

    res.json({
      message: "Hospital rejected successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
