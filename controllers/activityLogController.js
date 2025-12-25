const activityLogModel = require("../models/activityLog-model");
const { createLog } = require("./logController");


exports.getAllLogs = async (req, res) => {
  try {
    const logs = await activityLogModel
      .find()
      .populate("userId", "firstName email role")
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (err) {

    await createLog("ERROR", err.message, "Activity Log Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getLogsByModule = async (req, res) => {
  try {
    const { moduleName } = req.params;
    const logs = await activityLogModel.find({ module: moduleName });
    
    res.status(200).json({ success: true, data: logs });
 } catch (err) {

    await createLog("ERROR", err.message, "Activity Log Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.createLog = async (data) => {
  try {
    await activityLogModel.create(data);
  } catch (err) {
   
    await createLog("ERROR", err.message, "Activity Log Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    console.log("Log Error:", err.message);
  }
};