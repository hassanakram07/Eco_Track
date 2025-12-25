const sessionModel = require("../models/session-model");
const { createLog } = require("../controllers/logController");


// ✅ 1. Session Record Karna (Login ke waqt use hoga)
exports.createSession = async (sessionData) => {
  try {
    await sessionModel.create(sessionData);
    } catch (err) {
    await createLog("ERROR", err.message, "Session Module", { 
      stack: err.stack, 
      inputData: sessionData, 
      user: sessionData.userId ? sessionData.userId : "Guest" 
    });
    console.error("Session creation error:", err.message);
  }
};

// ✅ 2. Active Sessions dekhna (Security Dashboard)
exports.getActiveSessions = async (req, res) => {
  try {
    const sessions = await sessionModel.find({ 
      userId: req.user._id, 
      revoked: false,
      expiresAt: { $gt: new Date() } 
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: sessions.length, data: sessions });
    } catch (err) {
    await createLog("ERROR", err.message, "Session Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3. Session Revoke Karna (Remote Logout)
exports.revokeSession = async (req, res) => {
  try {
    const { id } = req.params;
    await sessionModel.findByIdAndUpdate(id, { revoked: true });

    res.status(200).json({ success: true, message: "Session revoked. User logged out from that device." });
  } catch (err) {
    await createLog("ERROR", err.message, "Session Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};