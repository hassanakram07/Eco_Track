const statModel = require("../models/recyclingStat-model");
const { createLog } = require("../controllers/logController");


// ✅ 1. Recycling Record entry (Employee/Staff Only)
exports.recordStat = async (req, res) => {
  try {
    const { 
      materialId, quantityKg, source, location, 
      batchCode, notes 
    } = req.body;

    const stat = await statModel.create({
      materialId,
      quantityKg,
      source,
      location,
      batchCode,
      recordedBy: req.user._id, // Staff member ID
      processedAt: Date.now()
    });

    res.status(201).json({
      success: true,
      message: "Recycling statistics recorded successfully",
      data: stat
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Stat Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2. Dashboard Analytics (Material-wise Total Quantity)
exports.getRecyclingImpact = async (req, res) => {
  try {
    const stats = await statModel.aggregate([
      {
        $group: {
          _id: "$materialId",
          totalRecycled: { $sum: "$quantityKg" },
          entriesCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "materials", // Your material collection name
          localField: "_id",
          foreignField: "_id",
          as: "materialDetails"
        }
      }
    ]);

    res.status(200).json({ success: true, data: stats });
   } catch (err) {
    await createLog("ERROR", err.message, "Stat Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3. Location-wise stats (Geographical analytics ke liye)
exports.getLocationStats = async (req, res) => {
  try {
    const data = await statModel.find().select("location quantityKg source");
    res.status(200).json({ success: true, data });
    } catch (err) {
    await createLog("ERROR", err.message, "Stat Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};