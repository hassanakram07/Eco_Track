const subscriptionModel = require("../models/subscription-model");
const { createLog } = require("../controllers/logController");


// ✅ 1. SUBSCRIBE KARNA
exports.createSubscription = async (req, res) => {
  try {
    const { plan, durationMonths, benefits, autoRenew, notes } = req.body;

    // Expiry date calculate karna (e.g. 1 mahina ya 1 saal)
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + (durationMonths || 1));

    const subscription = await subscriptionModel.create({
      userId: req.user._id, // Login user ki ID
      plan,
      expiresAt,
      benefits,
      autoRenew,
      notes
    });

    res.status(201).json({ 
      success: true, 
      message: `${plan} plan activated successfully`, 
      data: subscription 
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Subscription Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2. USER KI ACTIVE SUBSCRIPTION DEKHNA
exports.getMySubscription = async (req, res) => {
  try {
    const sub = await subscriptionModel.findOne({ 
      userId: req.user._id, 
      status: "Active" 
    }).sort({ startedAt: -1 });

    if (!sub) return res.status(404).json({ success: false, message: "No active subscription found" });

    res.status(200).json({ success: true, data: sub });
  } catch (err) {
    await createLog("ERROR", err.message, "Subscription Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3. SUBSCRIPTION CANCEL KARNA
exports.cancelSubscription = async (req, res) => {
  try {
    const sub = await subscriptionModel.findOneAndUpdate(
      { userId: req.user._id, status: "Active" },
      { status: "Cancelled", autoRenew: false },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Subscription cancelled", data: sub });
    } catch (err) {
    await createLog("ERROR", err.message, "Subscription Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};