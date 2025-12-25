const salesReportModel = require("../models/salesReport-model");
const orderModel = require("../models/order-model");
const revenueModel = require("../models/revenue-model");
const { createLog } = require("../controllers/logController");


// ✅ 1. Sales Report Generate Karna (Admin/Manager Only)
exports.generateReport = async (req, res) => {
  try {
    const { periodStart, periodEnd, notes } = req.body;

    // Dates ke darmiyan Orders ka data nikalna
    const orders = await orderModel.find({
      createdAt: { $gte: new Date(periodStart), $lte: new Date(periodEnd) },
      status: "Delivered" // Sirf mukammal orders ko count karein
    });

    // Total Sales aur Revenue calculate karna
    const totalSales = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const totalOrders = orders.length;

    // Report Code generate karna (e.g. REP-20251218)
    const reportCode = `REP-${Date.now()}`;

    const report = await salesReportModel.create({
      reportCode,
      periodStart,
      periodEnd,
      totalSales,
      totalOrders,
      totalRevenue: totalSales, // Base logic: Sales hi revenue hai
      generatedBy: req.user._id,
      notes
    });

    res.status(201).json({
      success: true,
      message: "Sales report generated successfully",
      data: report
    });
  } catch (err) {
    await createLog("ERROR", err.message, "Report Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2. Saari Reports ki List dekhna
exports.getAllReports = async (req, res) => {
  try {
    const reports = await salesReportModel.find()
      .populate("generatedBy", "firstName lastName")
      .sort({ generatedAt: -1 });

    res.status(200).json({ success: true, data: reports });
   } catch (err) {
    await createLog("ERROR", err.message, "Report Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};