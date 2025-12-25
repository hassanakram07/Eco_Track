const routeModel = require("../models/route-model");
const { createLog } = require("../controllers/logController");


// ✅ 1. Naya Route Plan Karna (Logistics Manager Only)
exports.createRoute = async (req, res) => {
  try {
    const { 
      routeCode, name, driverId, vehicleId, 
      stops, estimatedKm, estimatedTimeMin, frequency 
    } = req.body;

    const exist = await routeModel.findOne({ routeCode: routeCode.toUpperCase() });
    if (exist) return res.status(400).json({ success: false, message: "Route code already exists" });

    const route = await routeModel.create({
      routeCode: routeCode.toUpperCase(),
      name,
      driverId,
      vehicleId,
      stops,
      estimatedKm,
      estimatedTimeMin,
      frequency
    });

    res.status(201).json({
      success: true,
      message: "Logistics route planned successfully",
      data: route
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Route Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2. Driver ke mutabik Assigned Routes dekhna
exports.getDriverRoutes = async (req, res) => {
  try {
    const routes = await routeModel.find({ driverId: req.params.driverId, active: true })
      .populate("vehicleId", "plateNumber model")
      .populate("stops", "address locationName");

    res.status(200).json({ success: true, data: routes });
   } catch (err) {
    await createLog("ERROR", err.message, "Route Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3. Route Update Karna (Stops add/remove karna)
exports.updateRoute = async (req, res) => {
  try {
    const route = await routeModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!route) return res.status(404).json({ success: false, message: "Route not found" });

    res.status(200).json({ success: true, message: "Route updated", data: route });
   } catch (err) {
    await createLog("ERROR", err.message, "Route Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};