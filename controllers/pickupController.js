const pickupRequestModel = require("../models/pickupRequest-model");

exports.createpickupRequest = async (req, res) => {
  try {
    const {
      materialType,
      quantity,
      unit,
      pickupAddress,
      preferredDate,
      notes,
    } = req.body;

    const pickup = await pickupRequestModel.create({
      userId: req.user._id,
      materialType,
      quantity,
      unit,
      pickupAddress,
      preferredDate,
      notes,
    });
    res.status(201).json({
      success: true,
      message: "Pickup request created successfully",
      data: pickup,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.assignCollector = async (req, res) => {
  try {
    const pickup = await pickupRequestModel.findByIdAndUpdate(
      id,
      { assignedCollector: collectorId, status: "Assigned" },
      { new: true }
    );
    res
      .status(200)
      .json({
        success: true,
        message: "Collector assigned successfully",
        data: pickups,
      });
  } catch (err) {
    res.status(500).json({ success: true, message: err.message });
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
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};