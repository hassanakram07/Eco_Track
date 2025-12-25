const expenseModel = require("../models/expense-model");
const { createLog } = require("./logController");

// ✅ 1. Naya Expense record karna (Admin/Accounts Only)
exports.addExpense = async (req, res) => {
  try {
    const { 
      expenseCode, title, category, amount, 
      currency, date, recurring, notes 
    } = req.body;

    const exist = await expenseModel.findOne({ expenseCode });
    if (exist) return res.status(400).json({ success: false, message: "Expense code already exists" });

    const expense = await expenseModel.create({
      expenseCode,
      title,
      category,
      amount,
      currency,
      date,
      paidBy: req.user._id, // Jo admin login hai uska ID
      recurring,
      notes
    });

    res.status(201).json({
      success: true,
      message: "Expense recorded successfully",
      data: expense
    });
   } catch (err) {
    await createLog("ERROR", err.message, "Expense Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2. Saaray Expenses dekhna (Filters ke sath)
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await expenseModel
      .find()
      .populate("paidBy", "fullName email")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Expense Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3. Category ke mutabik kharchay dekhna (e.g., 'Fuel' or 'Rent')
exports.getExpensesByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const expenses = await expenseModel.find({ category: categoryName });
    
    const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    res.status(200).json({ 
      success: true, 
      category: categoryName,
      totalAmount,
      data: expenses 
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Expense Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};