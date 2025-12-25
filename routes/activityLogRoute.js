const express = require("express");
const router = express.Router();

const { getAllLogs, getLogsByModule } = require("../controllers/activityLogController");
const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

// Sirf Admin hi activity logs dekh sakta hai
router.get(
  "/all", 
  isLoggedin, 
  authorizeRoles("Admin"), 
  getAllLogs
);

router.get(
  "/module/:moduleName", 
  isLoggedin, 
  authorizeRoles("Admin"), 
  getLogsByModule
);

module.exports = router;



