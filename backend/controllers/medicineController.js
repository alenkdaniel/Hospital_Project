import Medicine from "../models/Medicine.js";

// =================================
// CREATE MEDICINE
// =================================

export const createMedicine = async (req, res) => {
  try {
    const {
      name,
      genericName,
      brandName,
      category,
      dosageForm,
      strength,
      manufacturer,
    } = req.body;

    // CHECK EXISTING MEDICINE

    const medicineExists = await Medicine.exists({
      name,
    });

    if (medicineExists) {
      return res.status(400).json({
        success: false,
        message: "Medicine already exists",
      });
    }

    const medicine = await Medicine.create({
      name,
      genericName,
      brandName,
      category,
      dosageForm,
      strength,
      manufacturer,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Medicine created successfully",
      medicine,
    });

  } catch (error) {
    console.error("CREATE MEDICINE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create medicine",
    });
  }
};

// =================================
// GET ALL MEDICINES
// =================================

export const getMedicines = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      category,
    } = req.query;

    // FILTER

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

    // DATA

    const medicines = await Medicine.find(filter)
      .sort({
        name: 1,
      })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Medicine.countDocuments(filter);

    return res.status(200).json({
      success: true,

      total,

      page: Number(page),

      pages: Math.ceil(total / limit),

      medicines,
    });

  } catch (error) {
    console.error("GET MEDICINES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch medicines",
    });
  }
};

// =================================
// GET MEDICINE BY ID
// =================================

export const getMedicineById = async (req, res) => {
  try {
    const { id } = req.params;

    const medicine = await Medicine.findById(id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    return res.status(200).json({
      success: true,
      medicine,
    });

  } catch (error) {
    console.error("GET MEDICINE BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch medicine",
    });
  }
};

// =================================
// UPDATE MEDICINE
// =================================

export const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    const medicine = await Medicine.findById(id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    const {
      name,
      genericName,
      brandName,
      category,
      dosageForm,
      strength,
      manufacturer,
      isActive,
    } = req.body;

    // CHECK DUPLICATE NAME

    if (name && name !== medicine.name) {
      const exists = await Medicine.exists({
        name,
        _id: {
          $ne: id,
        },
      });

      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Medicine already exists",
        });
      }
    }

    medicine.name = name ?? medicine.name;

    medicine.genericName =
      genericName ?? medicine.genericName;

    medicine.brandName =
      brandName ?? medicine.brandName;

    medicine.category =
      category ?? medicine.category;

    medicine.dosageForm =
      dosageForm ?? medicine.dosageForm;

    medicine.strength =
      strength ?? medicine.strength;

    medicine.manufacturer =
      manufacturer ?? medicine.manufacturer;

    medicine.isActive =
      isActive ?? medicine.isActive;

    medicine.updatedBy = req.user._id;

    await medicine.save();

    return res.status(200).json({
      success: true,
      message: "Medicine updated successfully",
      medicine,
    });

  } catch (error) {
    console.error("UPDATE MEDICINE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update medicine",
    });
  }
};

// =================================
// DELETE MEDICINE
// SOFT DELETE
// =================================

export const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    const medicine = await Medicine.findById(id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    if (!medicine.isActive) {
      return res.status(400).json({
        success: false,
        message: "Medicine already deleted",
      });
    }

    medicine.isActive = false;

    medicine.updatedBy = req.user._id;

    await medicine.save();

    return res.status(200).json({
      success: true,
      message: "Medicine deleted successfully",
    });

  } catch (error) {
    console.error("DELETE MEDICINE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete medicine",
    });
  }
};


// =================================
// SEARCH MEDICINES
// =================================

export const searchMedicines = async (req, res) => {
  try {
    const { keyword = "" } = req.query;

    const medicines = await Medicine.find({
      isActive: true,

      $or: [
        {
          name: {
            $regex: keyword,
            $options: "i",
          },
        },

        {
          genericName: {
            $regex: keyword,
            $options: "i",
          },
        },

        {
          brandName: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    })
      .select(
        "name genericName brandName dosageForm strength manufacturer"
      )
      .sort({
        name: 1,
      })
      .limit(20);

    return res.status(200).json({
      success: true,
      count: medicines.length,
      medicines,
    });

  } catch (error) {
    console.error("SEARCH MEDICINES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to search medicines",
    });
  }
};