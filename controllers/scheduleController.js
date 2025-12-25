const scheduleModel = require("../models/schedule-model");
const requestModel = require("../models/request-model");
const { createLog } = require("../controllers/logController");


// ✅ 1. Pickup Schedule Karna (Logistics Manager Only)
exports.createSchedule = async (req, res) => {
  try {
    const { 
      scheduleCode, requestId, pickupDate, windowStart, 
      windowEnd, employeeId, vehicleId, routeId, notes 
    } = req.body;

    // Check if schedule code is unique
    const exist = await scheduleModel.findOne({ scheduleCode: scheduleCode.toUpperCase() });
    if (exist) return res.status(400).json({ success: false, message: "Schedule code already exists" });

    const schedule = await scheduleModel.create({
      scheduleCode: scheduleCode.toUpperCase(),
      requestId,
      pickupDate,
      windowStart,
      windowEnd,
      employeeId,
      vehicleId,
      routeId,
      notes
    });

    // Request ka status update karna ke wo schedule ho chuki hai
    await requestModel.findByIdAndUpdate(requestId, { status: "Scheduled" });

    res.status(201).json({
      success: true,
      message: "Pickup scheduled successfully",
      data: schedule
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Schedule Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2. Aaj ke Schedules dekhna (Driver/Collector Dashboard)
exports.getTodaySchedules = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const schedules = await scheduleModel.find({
      pickupDate: { $gte: startOfDay, $lte: endOfDay },
      status: "Scheduled"
    })
    .populate("requestId")
    .populate("employeeId", "firstName lastName")
    .populate("vehicleId", "plateNumber");

    res.status(200).json({ success: true, data: schedules });
    } catch (err) {
    await createLog("ERROR", err.message, "Schedule Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3. Schedule Status Update (Completed/Missed)
exports.updateScheduleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const schedule = await scheduleModel.findByIdAndUpdate(id, { status }, { new: true });
    
    // Agar pickup complete ho jaye toh original request ko bhi update karein
    if (status === "Completed") {
      await requestModel.findByIdAndUpdate(schedule.requestId, { status: "Completed" });
    }

    res.status(200).json({ success: true, message: `Schedule marked as ${status}`, data: schedule });
    } catch (err) {
    await createLog("ERROR", err.message, "Schedule Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};