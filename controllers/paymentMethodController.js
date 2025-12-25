const paymentMethodModel = require("../models/paymentMethod-model");
const { createLog } = require("../controllers/logController");


// ✅ 1. Naya Payment Method Add Karna (Admin Only)
exports.addPaymentMethod = async (req, res) => {
  try {
    const { name, code, details, providerInfo, active } = req.body;

    const exist = await paymentMethodModel.findOne({ code: code.toUpperCase() });
    if (exist) return res.status(400).json({ success: false, message: "Payment method code already exists" });

    const method = await paymentMethodModel.create({
      name,
      code: code.toUpperCase(),
      details,
      providerInfo,
      active
    });

    res.status(201).json({
      success: true,
      message: "Payment method registered successfully",
      data: method
    });
  } catch (err) {
    await createLog("ERROR", err.message, "Payment Method Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2. Sirf Active Payment Methods dekhna (Checkout ke liye)
exports.getActiveMethods = async (req, res) => {
  try {
    const methods = await paymentMethodModel.find({ active: true });
    res.status(200).json({ success: true, count: methods.length, data: methods });
   } catch (err) {
    await createLog("ERROR", err.message, "Payment Method Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3. Method Status Update Karna (Enable/Disable)
exports.toggleMethodStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    const method = await paymentMethodModel.findByIdAndUpdate(
      id,
      { active },
      { new: true }
    );

    if (!method) return res.status(404).json({ success: false, message: "Method not found" });

    res.status(200).json({
      success: true,
      message: `Payment method is now ${active ? 'Active' : 'Inactive'}`,
      data: method
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Payment Method Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};