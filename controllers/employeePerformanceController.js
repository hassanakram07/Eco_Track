const performanceModel = require("../models/employeePerformance-model");
const { createLog } = require("./logController");

// ✅ 1. Performance Record Add/Update Karna (Admin/HR Only)
exports.addPerformanceRecord = async (req, res) => {
  try {
    const { 
      employeeId, periodStart, periodEnd, tasksAssigned, 
      tasksCompleted, avgCompletionTimeMin, rating, notes 
    } = req.body;

    const performance = await performanceModel.create({
      employeeId,
      periodStart,
      periodEnd,
      tasksAssigned,
      tasksCompleted,
      avgCompletionTimeMin,
      rating,
      notes
    });

    res.status(201).json({
      success: true,
      message: "Performance record added successfully",
      data: performance
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Employee Performance Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2. Specific Employee ki Performance Report dekhna
exports.getEmployeePerformance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const records = await performanceModel.find({ employeeId }).sort({ createdAt: -1 });

    if (!records || records.length === 0) {
      return res.status(404).json({ success: false, message: "No performance records found for this employee" });
    }

    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Employee Performance Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3. Company-wide Top Performers (Rating ke mutabik)
exports.getTopPerformers = async (req, res) => {
  try {
    const topPerformers = await performanceModel
      .find({ rating: { $gte: 4 } })
      .populate("employeeId", "firstName lastName email role")
      .limit(10);

    res.status(200).json({ success: true, data: topPerformers });
    } catch (err) {
    await createLog("ERROR", err.message, "Employee Performance Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};