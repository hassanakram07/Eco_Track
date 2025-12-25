const discountModel = require("../models/discount-model");
const { createLog } = require("./logController");


exports.createDiscount = async (req, res) => {
  try {
    const { 
      name, code, description, percentage, 
      maxAmount, minOrderValue, startDate, endDate 
    } = req.body;

   
    const discountExist = await discountModel.findOne({ code: code.toUpperCase() });
    if (discountExist) {
      return res.status(400).json({ success: false, message: "Discount code already exists" });
    }

    const discount = await discountModel.create({
      name,
      code: code.toUpperCase(),
      description,
      percentage,
      maxAmount,
      minOrderValue,
      startDate,
      endDate
    });

    res.status(201).json({
      success: true,
      message: "Discount offer created successfully",
      data: discount
    });
  } catch (err) {
    await createLog("ERROR", err.message, "Discount Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getActiveDiscounts = async (req, res) => {
  try {
    const now = new Date();
    const discounts = await discountModel.find({
      active: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    });

    res.status(200).json({ success: true, count: discounts.length, data: discounts });
   } catch (err) {
    await createLog("ERROR", err.message, "Discount Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.updateDiscount = async (req, res) => {
  try {
    const discount = await discountModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!discount) return res.status(404).json({ success: false, message: "Discount not found" });

    res.status(200).json({ success: true, message: "Discount updated", data: discount });
  } catch (err) {
    await createLog("ERROR", err.message, "Discount Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};