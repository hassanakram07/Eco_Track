const notificationModel = require("../models/notification-model");
const { createLog } = require("../controllers/logController");


// ✅ 1. User ke saare Notifications fetch karna
exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await notificationModel
      .find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Notification Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2. Notification ko 'Read' mark karna
exports.markAsRead = async (req, res) => {
  try {
    await notificationModel.findByIdAndUpdate(req.params.id, { read: true });
    res.status(200).json({ success: true, message: "Notification read" });
    } catch (err) {
    await createLog("ERROR", err.message, "Notification Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3. Saare notifications ko ek saath read mark karna
exports.readAll = async (req, res) => {
  try {
    await notificationModel.updateMany(
      { userId: req.user._id, read: false },
      { read: true }
    );
    res.status(200).json({ success: true, message: "All notifications marked as read" });
    } catch (err) {
    await createLog("ERROR", err.message, "Notification Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// 💡 4. Internal Helper (Not an API Route)
// Isko aap doosre controllers mein import karke use karenge
exports.sendNotification = async (userId, title, message, type = "info") => {
  try {
    await notificationModel.create({
      userId,
      title,
      message,
      type,
      sentAt: Date.now()
    });
   } catch (err) {
    await createLog("ERROR", err.message, "Notification Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    console.log("Notification Error: ", err.message);
  }
};