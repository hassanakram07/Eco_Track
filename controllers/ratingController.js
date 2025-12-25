const ratingModel = require("../models/rating-model");
const { createLog } = require("../controllers/logController");


// ✅ 1. Nayi Rating Submit Karna (User Only)
exports.submitRating = async (req, res) => {
  try {
    const { targetType, targetId, rating, comment } = req.body;

    // Check if user already rated this specific target
    const alreadyRated = await ratingModel.findOne({ 
      userId: req.user._id, 
      targetId, 
      targetType 
    });

    if (alreadyRated) {
      return res.status(400).json({ success: false, message: "You have already rated this item" });
    }

    const newRating = await ratingModel.create({
      targetType,
      targetId,
      userId: req.user._id,
      rating,
      comment
    });

    res.status(201).json({
      success: true,
      message: "Rating submitted successfully",
      data: newRating
    });
   } catch (err) {
    await createLog("ERROR", err.message, "Rating Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2. Kisi Specific Target ki Ratings dekhna (e.g., all ratings for a Product)
exports.getTargetRatings = async (req, res) => {
  try {
    const { targetId } = req.params;
    const ratings = await ratingModel
      .find({ targetId })
      .populate("userId", "firstName lastName")
      .sort({ createdAt: -1 });

    // Calculate Average Rating
    const total = ratings.reduce((acc, item) => acc + item.rating, 0);
    const average = ratings.length > 0 ? (total / ratings.length).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      averageRating: average,
      count: ratings.length,
      data: ratings
    });
  } catch (err) {
    await createLog("ERROR", err.message, "Rating Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3. Admin: Rating ko Verify karna (Verification Logic)
exports.verifyRating = async (req, res) => {
  try {
    const rating = await ratingModel.findByIdAndUpdate(
      req.params.id,
      { verified: true },
      { new: true }
    );
    if (!rating) return res.status(404).json({ success: false, message: "Rating not found" });

    res.status(200).json({ success: true, message: "Rating verified", data: rating });
   } catch (err) {
    await createLog("ERROR", err.message, "Rating Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};