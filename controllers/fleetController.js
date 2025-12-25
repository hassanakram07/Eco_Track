const fleetModel = require("../models/fleet-model");
const { createLog } = require("./logController");

// ✅ 1. Naya Vehicle Add Karna (Admin/Logistics Only)
exports.addVehicle = async (req, res) => {
  try {
    const { 
      vehicleNumber, model, type, capacityKg, 
      purchaseDate, lastServiceDate, insuranceExpiry 
    } = req.body;

    const vehicleExist = await fleetModel.findOne({ vehicleNumber });
    if (vehicleExist) {
      return res.status(400).json({ success: false, message: "Vehicle number already registered" });
    }

    const vehicle = await fleetModel.create({
      vehicleNumber,
      model,
      type,
      capacityKg,
      purchaseDate,
      lastServiceDate,
      insuranceExpiry
    });

    res.status(201).json({
      success: true,
      message: "Vehicle added to fleet successfully",
      data: vehicle
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Fleet Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2. Driver Assign Karna (Logistics Manager Only)
exports.assignDriver = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { employeeId } = req.body;

    const vehicle = await fleetModel.findByIdAndUpdate(
      vehicleId,
      { assignedDriver: employeeId },
      { new: true }
    ).populate("assignedDriver", "firstName lastName phone");

    if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found" });

    res.status(200).json({
      success: true,
      message: "Driver assigned successfully",
      data: vehicle
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Fleet Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3. Vehicle Status Update Karna (e.g., Sending for Maintenance)
exports.updateVehicleStatus = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { status, lastServiceDate } = req.body;

    const updateData = { status };
    if (lastServiceDate) updateData.lastServiceDate = lastServiceDate;

    const vehicle = await fleetModel.findByIdAndUpdate(
      vehicleId,
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `Vehicle status updated to ${status}`,
      data: vehicle
    });
   } catch (err) {
    await createLog("ERROR", err.message, "Fleet Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 4. Saari Vehicles ki Detail dekhna
exports.getFleetDetails = async (req, res) => {
  try {
    const fleet = await fleetModel.find().populate("assignedDriver", "firstName lastName");
    res.status(200).json({ success: true, count: fleet.length, data: fleet });
  } catch (err) {
    await createLog("ERROR", err.message, "Fleet Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};