const pickupRequestModel = require("../models/pickupRequest-model");
const { createLog } = require("../controllers/logController");


exports.createpickupRequest = async (req, res) => {
  try {
    // 1. User Validation
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "User authentication failed" });
    }

    const {
      materialType,
      wasteType,
      quantity,
      estimatedWeight,
      unit,
      pickupAddress,
      preferredDate,
      customerName,
      notes,
    } = req.body;

    // 2. Strict Mapping for Schema Requirements
    const validMaterialTypes = ["Plastic", "Paper", "Glass", "Metal", "E-Waste", "Other"];

    // Default to "Other" if wasteType is invalid or missing
    let finalMaterialType = "Other";
    const inputType = materialType || wasteType;
    if (inputType && validMaterialTypes.includes(inputType)) {
      finalMaterialType = inputType;
    }

    // Map weight to quantity (required)
    const finalQuantity = Number(quantity || estimatedWeight || 0);

    // 3. Create Record
    const pickup = await pickupRequestModel.create({
      userId: req.user._id,
      customerName: customerName || "Unknown Customer",

      // Mapped Fields
      materialType: finalMaterialType,
      wasteType: wasteType || finalMaterialType,

      quantity: finalQuantity,
      estimatedWeight: finalQuantity,

      unit: unit || 'kg',
      pickupAddress: pickupAddress || 'Depot Drop-off', // Required field default
      preferredDate: preferredDate || Date.now(),       // Required field default

      notes,
      assignedDriverName: 'Unassigned',
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: "Pickup request created successfully",
      data: pickup,
    });

  } catch (err) {
    console.error("Create Pickup Critical Error:", err);
    // Log internal error but don't crash
    try {
      await createLog("ERROR", err.message, "Pickup Module", {
        stack: err.stack,
        inputData: req.body,
        userId: req.user ? req.user._id : "Guest"
      });
    } catch (e) { console.error("Logger failed", e); }

    res.status(500).json({
      success: false,
      message: "Server Error: " + err.message
    });
  }
};

exports.getMyPickups = async (req, res) => {
  try {
    const pickups = await pickupRequestModel
      .find({ userId: req.user._id })
      .populate("assignedCollector", "firstName lastName email role");
    res
      .status(200)
      .json({ success: true, count: pickups.length, data: pickups });
  } catch (err) {
    await createLog("ERROR", err.message, "Pickup Module", {
      stack: err.stack,
      inputData: req.body,
      user: req.user ? req.user._id : "Guest"
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllPickups = async (req, res) => {
  try {
    const pickups = await pickupRequestModel
      .find()
      .populate("userId", "firstName email")
      .populate("assignedCollector", "firstName email role");
    res
      .status(200)
      .json({ success: true, count: pickups.length, data: pickups });
  } catch (err) {
    await createLog("ERROR", err.message, "Pickup Module", {
      stack: err.stack,
      inputData: req.body,
      user: req.user ? req.user._id : "Guest"
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.assignCollector = async (req, res) => {
  try {
    const { id } = req.params;
    const { collectorId, driverName, vehicleId } = req.body;

    const updateData = {
      status: "Assigned",
      assignedDriverName: driverName,
      assignedVehicleId: vehicleId
    };

    // If a real collector ID is provided, use it too
    if (collectorId) {
      updateData.assignedCollector = collectorId;
    }

    const pickup = await pickupRequestModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: "Pickup request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Driver assigned successfully",
      data: pickup,
    });
  } catch (err) {
    await createLog("ERROR", err.message, "Pickup Module", {
      stack: err.stack,
      inputData: req.body,
      user: req.user ? req.user._id : "Guest"
    });
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


exports.updatePickupStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, collectedWeight, notes } = req.body;

    const pickup = await pickupRequestModel.findByIdAndUpdate(
      id,
      { status, collectedWeight, notes, updatedAt: Date.now() },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Pickup status updated successfully",
      data: pickup,
    });
  } catch (err) {
    await createLog("ERROR", err.message, "Pickup Module", {
      stack: err.stack,
      inputData: req.body,
      user: req.user ? req.user._id : "Guest"
    });
    res.status(500).json({ success: false, message: err.message });
  }
};