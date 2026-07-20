import MedicalTest from "../models/MedicalTest.js";

// =================================
// CREATE MEDICAL TEST
// =================================

export const createMedicalTest = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      preparation,
      price,
    } = req.body;

    const exists = await MedicalTest.exists({
      name,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Medical test already exists",
      });
    }

    const medicalTest = await MedicalTest.create({
      name,
      category,
      description,
      preparation,
      price,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Medical test created successfully",
      medicalTest,
    });

  } catch (error) {
    console.error("CREATE MEDICAL TEST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create medical test",
    });
  }
};

// =================================
// GET ALL MEDICAL TESTS
// =================================

export const getMedicalTests = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      category,
    } = req.query;

    const filter = {
      isActive: true,
    };

    if (search) {
      filter.$text = {
        $search: search,
      };
    }

    if (category) {
      filter.category = category;
    }

    const medicalTests = await MedicalTest.find(filter)
      .sort({
        name: 1,
      })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await MedicalTest.countDocuments(filter);

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      medicalTests,
    });

  } catch (error) {
    console.error("GET MEDICAL TESTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch medical tests",
    });
  }
};

// =================================
// GET MEDICAL TEST BY ID
// =================================

export const getMedicalTestById = async (req, res) => {
  try {
    const { id } = req.params;

    const medicalTest = await MedicalTest.findById(id);

    if (!medicalTest) {
      return res.status(404).json({
        success: false,
        message: "Medical test not found",
      });
    }

    return res.status(200).json({
      success: true,
      medicalTest,
    });

  } catch (error) {
    console.error("GET MEDICAL TEST BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch medical test",
    });
  }
};

// =================================
// UPDATE MEDICAL TEST
// =================================

export const updateMedicalTest = async (req, res) => {
  try {
    const { id } = req.params;

    const medicalTest = await MedicalTest.findById(id);

    if (!medicalTest) {
      return res.status(404).json({
        success: false,
        message: "Medical test not found",
      });
    }

    const {
      name,
      category,
      description,
      preparation,
      price,
      isActive,
    } = req.body;

    // CHECK DUPLICATE NAME

    if (name && name !== medicalTest.name) {
      const exists = await MedicalTest.exists({
        name,
        _id: {
          $ne: id,
        },
      });

      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Medical test already exists",
        });
      }
    }

    medicalTest.name = name ?? medicalTest.name;

    medicalTest.category = category ?? medicalTest.category;

    medicalTest.description =
      description ?? medicalTest.description;

    medicalTest.preparation =
      preparation ?? medicalTest.preparation;

    medicalTest.price = price ?? medicalTest.price;

    medicalTest.isActive =
      isActive ?? medicalTest.isActive;

    medicalTest.updatedBy = req.user._id;

    await medicalTest.save();

    return res.status(200).json({
      success: true,
      message: "Medical test updated successfully",
      medicalTest,
    });

  } catch (error) {
    console.error("UPDATE MEDICAL TEST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update medical test",
    });
  }
};

// =================================
// DELETE MEDICAL TEST
// SOFT DELETE
// =================================

export const deleteMedicalTest = async (req, res) => {
  try {
    const { id } = req.params;

    const medicalTest = await MedicalTest.findById(id);

    if (!medicalTest) {
      return res.status(404).json({
        success: false,
        message: "Medical test not found",
      });
    }

    if (!medicalTest.isActive) {
      return res.status(400).json({
        success: false,
        message: "Medical test already deleted",
      });
    }

    medicalTest.isActive = false;

    medicalTest.updatedBy = req.user._id;

    await medicalTest.save();

    return res.status(200).json({
      success: true,
      message: "Medical test deleted successfully",
    });

  } catch (error) {
    console.error("DELETE MEDICAL TEST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete medical test",
    });
  }
};

// =================================
// SEARCH MEDICAL TESTS
// =================================

export const searchMedicalTests = async (req, res) => {
  try {
    const { keyword = "" } = req.query;

    const medicalTests = await MedicalTest.find({
      isActive: true,

      $or: [
        {
          name: {
            $regex: keyword,
            $options: "i",
          },
        },

        {
          category: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    })
      .select(
        "name category price preparation"
      )
      .sort({
        name: 1,
      })
      .limit(20);

    return res.status(200).json({
      success: true,
      count: medicalTests.length,
      medicalTests,
    });

  } catch (error) {
    console.error("SEARCH MEDICAL TEST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to search medical tests",
    });
  }
};