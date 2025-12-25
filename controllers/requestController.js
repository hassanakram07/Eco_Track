const requestModel = require("../models/request-model");
const { sendNotification } = require("./notificationController");
const { createLog } = require("../controllers/logController");


// ✅ 1. Nayi Pickup Request Create Karna (Customer Only)
exports.createRequest = async (req, res) => {
  try {
    const { 
      requestNumber, materialId, materialName, quantity, 
      pickupAddress, pickupLatLng, scheduledAt, priority, notes 
    } = req.body;

    const request = await requestModel.create({
      requestNumber,
      customerId: req.user._id,
      materialId,
      materialName,
      quantity,
      pickupAddress,
      pickupLatLng,
      scheduledAt,
      priority,
      notes
    });

    res.status(201).json({
      success: true,
      message: "Pickup request submitted successfully",
      data: request
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Request Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2. Request Assignment (Admin/Logistics Only)
exports.assignToCollector = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId } = req.body;

    const request = await requestModel.findByIdAndUpdate(
      id,
      { 
        assignedTo: employeeId, 
        status: "Assigned",
        updatedAt: Date.now() 
      },
      { new: true }
    ).populate("assignedTo", "firstName lastName phone");

    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    // Notify Customer
    await sendNotification(request.customerId, "Collector Assigned", `A collector has been assigned to your request ${request.requestNumber}`, "info");

    res.status(200).json({ success: true, message: "Collector assigned", data: request });
    } catch (err) {
    await createLog("ERROR", err.message, "Request Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3. Status Update Karna (Collector/Admin Only)
// Request Controller ke andar (Top par import laazmi hai)
const { logStatusChange } = require("./statusHistoryController");

exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note, location } = req.body; // Note aur location optional hain

    // 1. Pehle purana record fetch karein (fromStatus nikalne ke liye)
    const oldRequest = await requestModel.findById(id);
    if (!oldRequest) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    // 2. Request table mein status update karein
    const updatedRequest = await requestModel.findByIdAndUpdate(
      id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    // 3. ⭐️ History Record Create Karein
    // Yeh wohi function hai jo humne log-keeping ke liye banaya tha
    await logStatusChange({
      requestId: updatedRequest._id,
      fromStatus: oldRequest.status, // Purana status yahan se aaya
      toStatus: status,              // Naya status jo req.body se aaya
      changedBy: req.user._id,       // Login user ki ID
      changedByType: req.user.role,  // Login user ka role (Admin/Collector)
      note: note || "Status updated",
      locationAtChange: location || null
    });

    // 4. Customer ko Notify karein (Jaisa aapke screenshot mein tha)
    await sendNotification(
      updatedRequest.customerId, 
      "Status Update", 
      `Your pickup request is now ${status}`, 
      "info"
    );

    res.status(200).json({ success: true, data: updatedRequest });

    } catch (err) {
    await createLog("ERROR", err.message, "Request Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};