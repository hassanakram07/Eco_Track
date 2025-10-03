const mongoose = require("mongoose");

const employeePerformanceSchema = mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "employee", required: true },
  periodStart: { type: Date },
  periodEnd: { type: Date },
  tasksAssigned: { type: Number, default: 0 },
  tasksCompleted: { type: Number, default: 0 },
  avgCompletionTimeMin: { type: Number },
  rating: { type: Number, min: 0, max: 5 },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("employeePerformance", employeePerformanceSchema);
