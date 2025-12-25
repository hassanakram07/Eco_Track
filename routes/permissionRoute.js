const express = require("express");
const router = express.Router();

const { 
  createPermission, 
  getAllPermissions, 
  getPermissionsByModule, 
  updatePermission 
} = require("../controllers/permissionController");

const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

// 🔒 Sirf SuperAdmin hi Permissions manage kar sakta hai
router.post(
  "/register", 
  isLoggedin, 
  authorizeRoles("SuperAdmin"), 
  createPermission
);

router.get(
  "/all", 
  isLoggedin, 
  authorizeRoles("SuperAdmin", "Admin"), 
  getAllPermissions
);

router.get(
  "/module/:moduleName", 
  isLoggedin, 
  authorizeRoles("SuperAdmin"), 
  getPermissionsByModule
);

router.put(
  "/update/:id", 
  isLoggedin, 
  authorizeRoles("SuperAdmin"), 
  updatePermission
);

module.exports = router;