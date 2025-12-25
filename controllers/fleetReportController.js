const fleetReportModel = require("../models/fleetReport-model");
const { createLog } = require("./logController");

// ✅ 1. Nayi Report Generate Karna (Admin/Logistics Only)
exports.generateReport = async (req, res) => {
  try {
    const { 
      fleetId, period, totalKm, trips, 
      fuelConsumedLiters, maintenanceCost, 
      avgLoadKg, incidents 
    } = req.body;

    const report = await fleetReportModel.create({
      fleetId,
      period,
      totalKm,
      trips,
      fuelConsumedLiters,
      maintenanceCost,
      avgLoadKg,
      incidents
    });

    res.status(201).json({
      success: true,
      message: `Fleet report for ${period} generated successfully`,
      data: report
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Fleet Report Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2. Kisi Specific Gaari ki saari Reports dekhna
exports.getFleetReports = async (req, res) => {
  try {
    const { fleetId } = req.params;
    const reports = await fleetReportModel
      .find({ fleetId })
      .populate("fleetId", "vehicleNumber model type")
      .sort({ generatedAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Fleet Report Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3. Fuel Efficiency Analytics (Liters per KM)
exports.getFuelEfficiency = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await fleetReportModel.findById(reportId);

    if (!report) return res.status(404).json({ success: false, message: "Report not found" });

    // Calculate KM per Liter
    const efficiency = report.totalKm / report.fuelConsumedLiters;

    res.status(200).json({
      success: true,
      data: {
        vehicleId: report.fleetId,
        period: report.period,
        kmPerLiter: efficiency.toFixed(2),
        totalTrips: report.trips
      }
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Fleet Report Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};