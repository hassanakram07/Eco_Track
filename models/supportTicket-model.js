const mongoose = require("mongoose");

const supportTicketSchema = mongoose.Schema({
  ticketNumber: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  priority: { type: String, enum: ["Low", "Normal", "High"], default: "Normal" },
  status: { type: String, enum: ["Open", "In Progress", "Resolved", "Closed"], default: "Open" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "employee" },
  attachments: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("supportTicket", supportTicketSchema);
