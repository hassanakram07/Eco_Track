const feedbackModel = require("../models/feedback-model");
const { createLog } = require("./logController");

// ✅ 1. Naya Feedback Submit Karna (User Only)
exports.submitFeedback = async (req, res) => {
  try {
    const { 
      requestId, productId, rating, title, 
      comment, photos 
    } = req.body;

    const feedback = await feedbackModel.create({
      userId: req.user._id, // Logged in user ID
      requestId,
      productId,
      rating,
      title,
      comment,
      photos
    });

    res.status(201).json({
      success: true,
      message: "Thank you for your feedback!",
      data: feedback
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Feedback Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2. Saaray Feedbacks dekhna (Admin Only)
exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await feedbackModel
      .find()
      .populate("userId", "firstName email")
      .populate("productId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Feedback Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3. Feedback ka Jawab dena (Admin Only)
exports.respondToFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { response } = req.body;

    const feedback = await feedbackModel.findByIdAndUpdate(
      feedbackId,
      { 
        response, 
        resolved: true 
      },
      { new: true }
    );

    if (!feedback) return res.status(404).json({ success: false, message: "Feedback not found" });

    res.status(200).json({
      success: true,
      message: "Response sent and feedback marked as resolved",
      data: feedback
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Feedback Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};