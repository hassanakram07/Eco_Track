const salaryModel = require("../models/salary-model");
const revenueModel = require("../models/revenue-model"); // Expense record karne ke liye
const { createLog } = require("../controllers/logController");


// ✅ 1. Salary Slip Generate Karna (HR/Admin Only)
exports.generateSalary = async (req, res) => {
  try {
    const { 
      employeeId, period, basic, allowances, 
      deductions, paymentMethod, notes 
    } = req.body;

    // Net Pay calculation: Basic + Allowances - Deductions
    const netPay = (basic + allowances) - deductions;

    const salary = await salaryModel.create({
      employeeId,
      period,
      basic,
      allowances,
      deductions,
      netPay,
      paymentMethod,
      notes
    });

    res.status(201).json({
      success: true,
      message: `Salary slip for ${period} generated`,
      data: salary
    });
   } catch (err) {
    await createLog("ERROR", err.message, "Salary Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2. Salary Pay Karna (Finance Only)
exports.paySalary = async (req, res) => {
  try {
    const { id } = req.params;

    const salary = await salaryModel.findByIdAndUpdate(
      id,
      { status: "Paid", paidAt: Date.now() },
      { new: true }
    );

    if (!salary) return res.status(404).json({ success: false, message: "Salary record not found" });

    // Industrial Logic: Salary pay hone par isay financial records mein track kiya ja sakta hai
    // Aap yahan Expense model mein entry daal sakte hain (agar aapne expense model banaya hai)

    res.status(200).json({
      success: true,
      message: "Salary marked as Paid",
      data: salary
    });
  } catch (err) {
    await createLog("ERROR", err.message, "Salary Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3. Employee ki apni Salary History dekhna
exports.getMySalaries = async (req, res) => {
  try {
    const salaries = await salaryModel.find({ employeeId: req.user._id }).sort({ period: -1 });
    res.status(200).json({ success: true, data: salaries });
  } catch (err) {
    await createLog("ERROR", err.message, "Salary Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};