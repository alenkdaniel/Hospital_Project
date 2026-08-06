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

    // ⭐ RATING IS PATIENT-DRIVEN ONLY
    // Hospital admins never set their own rating — it is
    // always computed from Review documents (see
    // reviewController.recomputeHospitalRating). Strip it
    // here even though the create form never sends it, so a
    // direct API call (Postman, etc.) can't inject one.

    delete req.body.rating;

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

      icu,

      acceptingPatients,

      // ⭐ GEO SEARCH — lat/lng come from Mapbox: either the
      // browser's GPS position, or the coordinates Mapbox
      // returns for whichever place the user picked in the
      // city autocomplete (same API already used for the
      // place suggestions dropdown).

      lat,

      lng,

      // Radius in kilometers — defaults to 25km.

      distance,
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

    if (emergency === "true") {
      filter["emergency.available"] = true;
    }

    if (icu === "true") {
      // `facilities` is a free-text string array (e.g. "ICU",
      // "MRI", "Blood Bank") rather than a dedicated boolean
      // field, so match it the same way the rest of the app does.

      filter.facilities = {
        $regex: "icu",

        $options: "i",
      };
    }

    if (acceptingPatients === "true") {
      // No dedicated flag exists on the model for this yet —
      // "accepting patients" is treated as "has open beds",
      // which is the closest real signal currently tracked.

      filter["beds.available"] = {
        $gt: 0,
      };
    }

    if (rating) {
      filter["rating.average"] = {
        $gte: Number(rating),
      };
    }

    // =====================================
    // GEO-DISTANCE SEARCH
    // Only when coordinates were supplied.
    // Uses the existing 2dsphere index on
    // `location` via $geoNear, which both
    // filters by radius AND returns each
    // hospital's distance — far cheaper and
    // more accurate than calling an external
    // API per hospital.
    // =====================================

    if (lat && lng) {
      const maxDistanceMeters = (Number(distance) || 25) * 1000;

      const geoFilter = { ...filter };

      // $text can't run inside $geoNear's query — fall back to
      // a plain name match for free-text search in this branch.

      if (search) {
        geoFilter.name = {
          $regex: search,

          $options: "i",
        };
      }

      const hospitals = await Hospital.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",

              coordinates: [Number(lng), Number(lat)],
            },

            distanceField: "distanceInMeters",

            maxDistance: maxDistanceMeters,

            spherical: true,

            query: geoFilter,
          },
        },

        {
          $addFields: {
            distanceInKm: {
              $round: [
                {
                  $divide: ["$distanceInMeters", 1000],
                },

                1,
              ],
            },
          },
        },
      ]);

      return res.json(hospitals);
    }

    // =====================================
    // REGULAR (NON-GEO) SEARCH
    // =====================================

    if (search) {
      filter.$text = {
        $search: search,
      };
    }

    const hospitals = await Hospital.find(filter).sort({
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

    const hospitals = await Hospital.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",

            coordinates: [Number(lng), Number(lat)],
          },

          distanceField: "distanceInMeters",

          maxDistance: Number(distance),

          spherical: true,

          query: {
            "verification.status": "approved",

            isActive: true,

            isDeleted: false,
          },
        },
      },

      {
        $addFields: {
          distanceInKm: {
            $round: [
              {
                $divide: ["$distanceInMeters", 1000],
              },

              1,
            ],
          },
        },
      },
    ]);

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

    // protect approval + rating
    // (rating is patient-review-driven only — see createHospital)

    delete req.body.verification;

    delete req.body.createdBy;

    delete req.body.rating;

    if (req.files?.images) {
      req.body.images = req.files.images.map((file) => ({
        url: file.path,

        publicId: file.filename,
      }));
    }

    // Certificate re-upload on edit — kept separate from the
    // `verification` object above (which is fully stripped) so
    // this doesn't touch verification.status. Dot-notation key
    // updates just this one nested field.

    if (req.files?.certificate) {
      req.body["verification.documents.certificateUrl"] =
        req.files.certificate[0].path;
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