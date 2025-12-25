const express = require("express");
const router = express.Router();

const { 
  createRole, 
  getRoles, 
  updateRolePermissions 
} = require("../controllers/roleController");

const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

// 🔒 SuperAdmin: Role aur Permissions manage karne ke liye
router.post("/create", isLoggedin, authorizeRoles("SuperAdmin"), createRole);
router.get("/all", isLoggedin, authorizeRoles("SuperAdmin", "Admin"), getRoles);
router.put("/update-permissions/:id", isLoggedin, authorizeRoles("SuperAdmin"), updateRolePermissions);

module.exports = router;