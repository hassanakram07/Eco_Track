const express = require("express");
const router = express.Router();
const { registerAdmin, loginAdmin, getAllAdmins } = require("../controllers/adminController");
const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

// Public Route for Login
router.post("/login", loginAdmin);

// Restricted Routes
router.post("/register", isLoggedin, authorizeRoles("SuperAdmin"), registerAdmin);
router.get("/all", isLoggedin, authorizeRoles("SuperAdmin"), getAllAdmins);

module.exports = router;