const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String }, // info, warning, alert
  data: { type: Object },
  read: { type: Boolean, default: false },
  channel: { type: String, default: "in-app" }, // email, sms
  sentAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("notification", notificationSchema);
