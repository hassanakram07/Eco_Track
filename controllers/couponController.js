const couponModel = require("../models/coupon-model");
const { createLog } = require("./logController");


exports.createCoupon = async (req, res) => {
  try {
    const { code, discountId, usageLimit, assignedToUser, validFrom, validUntil, note } = req.body;

    const exist = await couponModel.findOne({ code: code.toUpperCase() });
    if (exist) return res.status(400).json({ success: false, message: "Coupon code already exists" });

    const coupon = await couponModel.create({
      code: code.toUpperCase(),
      discountId,
      usageLimit,
      assignedToUser,
      validFrom,
      validUntil,
      note
    });

    res.status(201).json({ success: true, message: "Coupon created successfully", data: coupon });
  } catch (err) {

    await createLog("ERROR", err.message, "Coupon Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await couponModel.findOne({ code: code.toUpperCase(), active: true });

    if (!coupon) return res.status(404).json({ success: false, message: "Invalid or inactive coupon" });


    const now = new Date();
    if (coupon.validFrom && now < coupon.validFrom) 
        return res.status(400).json({ success: false, message: "Coupon is not yet active" });
    if (coupon.validUntil && now > coupon.validUntil) 
        return res.status(400).json({ success: false, message: "Coupon has expired" });


    if (coupon.usedCount >= coupon.usageLimit) 
        return res.status(400).json({ success: false, message: "Coupon limit reached" });

   
    if (coupon.assignedToUser && coupon.assignedToUser.toString() !== req.user._id.toString())
        return res.status(403).json({ success: false, message: "This coupon is not for you" });

    res.status(200).json({ 
        success: true, 
        message: "Coupon is valid", 
        discountId: coupon.discountId 
    });
  } catch (err) {

    await createLog("ERROR", err.message, "Coupon Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await couponModel.find().populate("assignedToUser", "firstName email");
    res.status(200).json({ success: true, data: coupons });
  } catch (err) {
    await createLog("ERROR", err.message, "Coupon Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};