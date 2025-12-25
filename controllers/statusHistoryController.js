const historyModel = require("../models/requestStatusHistory-model");
const { createLog } = require("../controllers/logController");


// ✅ 1. Status Change Log Record Karna (Internal Function)
// Isay aap Request Controller ke status update function mein call karenge
exports.logStatusChange = async (data) => {
  try {
    const { requestId, fromStatus, toStatus, changedBy, changedByType, note, locationAtChange } = data;
    
    await historyModel.create({
      requestId,
      fromStatus,
      toStatus,
      changedBy,
      changedByType,
      note,
      locationAtChange
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Status History Module", { 
      stack: err.stack, 
      inputData: data, 
      user: data.changedBy ? data.changedBy : "Guest" 
    });
    console.error("History Log Error:", err.message);
  }
};

// ✅ 2. Kisi Request ki Poori History dekhna (Admin/Audit Only)
exports.getRequestTimeline = async (req, res) => {
  try {
    const { requestId } = req.params;
    const timeline = await historyModel
      .find({ requestId })
      .populate("changedBy", "firstName lastName email role")
      .sort({ changedAt: 1 }); // Purane se naye ki taraf

    res.status(200).json({
      success: true,
      count: timeline.length,
      data: timeline
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Status History Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3. Latest Status Change dekhna
exports.getLatestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const latest = await historyModel
      .findOne({ requestId })
      .sort({ changedAt: -1 });

    res.status(200).json({ success: true, data: latest });
    } catch (err) {
    await createLog("ERROR", err.message, "Status History Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};