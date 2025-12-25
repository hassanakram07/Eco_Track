const express = require("express");
const router = express.Router();
const { getLogs, resolveLog } = require("../controllers/logController");
const { isLoggedin, authorizePermissions } = require("../middleware/isLoggedin");

// 🔒 Admin: Logs dekhne aur resolve karne ke liye
router.get("/all", isLoggedin, authorizePermissions("view_system_logs"), getLogs);
router.put("/resolve/:id", isLoggedin, authorizePermissions("manage_system_logs"), resolveLog);

module.exports = router;