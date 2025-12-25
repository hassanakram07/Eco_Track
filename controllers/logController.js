const systemLogModel = require("../models/systemLog-model");



// ✅ 1. AUTOMATIC LOG CREATOR (Helper Function)
// Isay aap baqi controllers mein use karenge errors record karne ke liye
exports.createLog = async (level, message, moduleName, details = {}) => {
  try {
    await systemLogModel.create({
      level,
      message,
      module: moduleName,
      details
    });
  } catch (err) {
    console.error("Log generation failed:", err.message);
  }
};

// ✅ 2. GET ALL LOGS (Admin Only)
exports.getLogs = async (req, res) => {
  try {
    const logs = await systemLogModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: logs.length, data: logs });
    } catch (err) {
    await createLog("ERROR", err.message, "Log Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3. RESOLVE LOG/ERROR
exports.resolveLog = async (req, res) => {
  try {
    const log = await systemLogModel.findByIdAndUpdate(
      req.params.id,
      { resolved: true, resolvedAt: Date.now() },
      { new: true }
    );
    res.status(200).json({ success: true, message: "Log marked as resolved", data: log });
    } catch (err) {
    await createLog("ERROR", err.message, "Log Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};