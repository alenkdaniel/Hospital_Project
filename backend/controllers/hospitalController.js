import Hospital from "../models/Hospital.js";

export const createHospital = async (req, res) => {
  try {
    if (req.user.role !== "hospital_admin") {
      return res.status(403).json({
        message: "Only hospital admin allowed",
      });
    }

    const exists = await Hospital.findOne({
      createdBy: req.user._id,

      isDeleted: false,
    });

    if (exists) {
      return res.status(400).json({
        message: "Hospital already exists",
      });
    }

    // IMAGES CLOUDINARY

    const images = req.files?.images
      ? req.files.images.map((file) => ({
          url: file.path,

          publicId: file.filename,
        }))
      : [];

    // CERTIFICATE

    const certificateUrl = req.files?.certificate
      ? req.files.certificate[0].path
      : "";

    // CREATE

    const hospital = await Hospital.create({
      ...req.body,

      images,

      createdBy: req.user._id,

      verification: {
        status: "pending",

        documents: {
          registrationNumber: req.body.registrationNumber,

          licenseNumber: req.body.licenseNumber,

          certificateUrl,
        },
      },
    });

    res.status(201).json({
      message: "Hospital submitted for approval",

      hospital,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =================================
// GET MY HOSPITAL
// =================================

export const getMyHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findOne({
      createdBy: req.user._id,

      isDeleted: false,
    });

    if (!hospital) {
      return res.status(404).json({
        message: "Hospital not found",
      });
    }

    res.json(hospital);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =================================
// GET APPROVED HOSPITALS
// pagination
// =================================

export const getHospitals = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const hospitals = await Hospital.find({
      "verification.status": "approved",

      isActive: true,

      isDeleted: false,
    })

      .skip(skip)

      .limit(limit)

      .sort({
        "rating.average": -1,
      });

    const total = await Hospital.countDocuments({
      "verification.status": "approved",

      isDeleted: false,
    });

    res.json({
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
// SEARCH + FILTER
// =================================

export const searchHospitals = async (req, res) => {
  try {
    const {
      city,

      department,

      type,

      emergency,

      search,

      rating,
      
    } = req.query;

    let filter = {
      "verification.status": "approved",

      isDeleted: false,

      isActive: true,
    };

    if (city) {
      filter["address.city"] = {
        $regex: city,

        $options: "i",
      };
    }

    if (department) {
      filter.departments = {
        $regex: department,

        $options: "i",
      };
    }

    if (type) {
      filter.hospitalType = type;
    }

    if (emergency) {
      filter["emergency.available"] = emergency === "true";
    }

    if (search) {
      filter.$text = {
        $search: search,
      };
    }

    if (rating) {
      filter["rating.average"] = {
        $gte: Number(rating),
      };
    }

    const hospitals = await Hospital.find(filter)

      .sort({
        "rating.average": -1,
      });

    res.json(hospitals);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =================================
// NEARBY HOSPITALS
// GEO LOCATION
// =================================

export const getNearbyHospitals = async (req, res) => {
  try {
    const {
      lat,

      lng,

      distance = 10000,
    } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        message: "Latitude and longitude required",
      });
    }

    const hospitals = await Hospital.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",

            coordinates: [Number(lng), Number(lat)],
          },

          $maxDistance: Number(distance),
        },
      },

      "verification.status": "approved",

      isActive: true,

      isDeleted: false,
    });

    res.json(hospitals);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =================================
// SINGLE HOSPITAL
// =================================

export const getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findOne({
      _id: req.params.id,

      isDeleted: false,
    })

      .populate(
        "createdBy",

        "name email",
      );

    if (!hospital) {
      return res.status(404).json({
        message: "Hospital not found",
      });
    }

    res.json(hospital);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =================================
// UPDATE HOSPITAL
// =================================

export const updateHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({
        message: "Hospital not found",
      });
    }

    if (
      req.user.role !== "super_admin" &&
      hospital.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    // protect approval

    delete req.body.verification;

    delete req.body.createdBy;

    if (req.files?.images) {
      req.body.images = req.files.images.map((file) => ({
        url: file.path,

        publicId: file.filename,
      }));
    }

    const updated = await Hospital.findByIdAndUpdate(
      req.params.id,

      req.body,

      {
        new: true,

        runValidators: true,
      },
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =================================
// SOFT DELETE HOSPITAL
// =================================

export const deleteHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id).populate(
      "createdBy",
      "name email phone accountStatus",
    );

    if (!hospital) {
      return res.status(404).json({
        message: "Hospital not found",
      });
    }

    if (
      req.user.role !== "super_admin" &&
      hospital.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    hospital.isDeleted = true;

    hospital.isActive = false;

    await hospital.save();

    res.json({
      message: "Hospital removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
