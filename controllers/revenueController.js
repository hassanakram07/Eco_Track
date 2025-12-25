const revenueModel = require("../models/revenue-model");
const { createLog } = require("../controllers/logController");

// ✅ 1. Naya Revenue Record karna (Internal/Manual Entry)
exports.recordRevenue = async (req, res) => {
  try {
    const { revenueCode, source, amount, referenceId, notes } = req.body;

    const exist = await revenueModel.findOne({ revenueCode });
    if (exist) return res.status(400).json({ success: false, message: "Revenue code already exists" });

    const revenue = await revenueModel.create({
      revenueCode,
      source,
      amount,
      referenceId,
      notes,
      recordedBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Revenue recorded successfully",
      data: revenue
    });
   } catch (err) {
    await createLog("ERROR", err.message, "Revenue Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2. Total Revenue Analytics (Dashboard ke liye)
exports.getRevenueStats = async (req, res) => {
  try {
    const stats = await revenueModel.aggregate([
      {
        $group: {
          _id: "$source",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      }
    ]);

    const grandTotal = stats.reduce((sum, item) => sum + item.totalAmount, 0);

    res.status(200).json({
      success: true,
      grandTotal,
      breakdown: stats
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Revenue Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3. Date Range ke mutabik Revenue dekhna
exports.getRevenueByPeriod = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const report = await revenueModel.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    }).sort({ date: -1 });

    res.status(200).json({ success: true, count: report.length, data: report });
   } catch (err) {
    await createLog("ERROR", err.message, "Revenue Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};