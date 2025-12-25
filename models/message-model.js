const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  fromId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  toId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subject: { type: String },
  content: { type: String, required: true },
  attachments: [{ type: String }],
  read: { type: Boolean, default: false },
  repliedTo: { type: mongoose.Schema.Types.ObjectId, ref: "message" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("message", messageSchema);
