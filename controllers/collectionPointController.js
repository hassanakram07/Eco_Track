const collectionPointModel = require("../models/collectionPoint-model");
const { createLog } = require("./logController");


exports.createCollectionPoint = async (req, res) => {
  try {
    const { code, name, address, city, contactPerson, contactPhone, coordinates, openingHours } = req.body;

    const exist = await collectionPointModel.findOne({ code });
    if (exist) return res.status(400).json({ success: false, message: "Code already exists" });

    const point = await collectionPointModel.create({
      code,
      name,
      address,
      city,
      contactPerson,
      contactPhone,
      coordinates,
      openingHours
    });

    res.status(201).json({ success: true, message: "Collection Point Created", data: point });
  } catch (err) {

    await createLog("ERROR", err.message, "Collection Point Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getAllPoints = async (req, res) => {
  try {
    const points = await collectionPointModel.find({ active: true });
    res.status(200).json({ success: true, count: points.length, data: points });
 } catch (err) {

    await createLog("ERROR", err.message, "Collection Point Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.updatePoint = async (req, res) => {
  try {
    const point = await collectionPointModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!point) return res.status(404).json({ success: false, message: "Not Found" });

    res.status(200).json({ success: true, message: "Updated successfully", data: point });
 } catch (err) {

    await createLog("ERROR", err.message, "Collection Point Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.deletePoint = async (req, res) => {
  try {
    await collectionPointModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Point Deleted" });
} catch (err) {

    await createLog("ERROR", err.message, "Collection Point Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};