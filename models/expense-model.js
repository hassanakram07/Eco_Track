const mongoose = require("mongoose");

const expenseSchema = mongoose.Schema({
  expenseCode: { type: String, unique: true },
  title: { type: String, required: true },
  category: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: "PKR" },
  date: { type: Date, default: Date.now },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
  attachment: { type: String },
  recurring: { type: Boolean, default: false },
  notes: { type: String },
});

module.exports = mongoose.model("expense", expenseSchema);
