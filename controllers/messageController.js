const messageModel = require("../models/message-model");
const { createLog } = require("../controllers/logController");


// ✅ 1. Naya Message Send Karna
exports.sendMessage = async (req, res) => {
  try {
    const { toId, subject, content, attachments, repliedTo } = req.body;

    const message = await messageModel.create({
      fromId: req.user._id, // Logged in sender
      toId,
      subject,
      content,
      attachments,
      repliedTo
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Message Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2. Inbox Dekhna (Messages received by the logged-in user)
exports.getInbox = async (req, res) => {
  try {
    const messages = await messageModel
      .find({ toId: req.user._id })
      .populate("fromId", "firstName lastName email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
   } catch (err) {
    await createLog("ERROR", err.message, "Message Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3. Message ko 'Read' mark karna
exports.markAsRead = async (req, res) => {
  try {
    const message = await messageModel.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!message) return res.status(404).json({ success: false, message: "Message not found" });

    res.status(200).json({ success: true, message: "Message marked as read" });
   } catch (err) {
    await createLog("ERROR", err.message, "Message Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 4. Sent Messages Dekhna
exports.getSentMessages = async (req, res) => {
  try {
    const messages = await messageModel
      .find({ fromId: req.user._id })
      .populate("toId", "firstName lastName email");

    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    await createLog("ERROR", err.message, "Message Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
}; 