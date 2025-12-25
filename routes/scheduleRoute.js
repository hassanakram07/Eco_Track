const express = require("express");
const router = express.Router();

const { 
  createSchedule, 
  getTodaySchedules, 
  updateScheduleStatus 
} = require("../controllers/scheduleController");

const { isLoggedin, authorizePermissions } = require("../middleware/isLoggedin");

// 🔒 Logistics/Admin: Scheduling create karne ke liye
router.post(
  "/create", 
  isLoggedin, 
  authorizePermissions("manage_schedules"), 
  createSchedule
);

// 🔒 Driver/Staff: Aaj ke tasks dekhne ke liye
router.get("/today", isLoggedin, getTodaySchedules);

// 🔒 Status update (Completed/Missed)
router.put(
  "/status/:id", 
  isLoggedin, 
  authorizePermissions("update_schedule_status"), 
  updateScheduleStatus
);

module.exports = router;