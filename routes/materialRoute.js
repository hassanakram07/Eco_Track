const express = require("express");
const router = express.Router();

const {
  createMaterial,
  getAllMaterials,
  updateMaterial,
  getHazardousMaterials,
  deleteMaterial
} = require("../controllers/materialController");

const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

// 🔓 Public: Users can see rates and material types
router.get("/list", getAllMaterials);

// 🔒 Admin/Manager: Manage material configurations
router.post("/create", isLoggedin, authorizeRoles("Admin", "Manager"), createMaterial);
router.put("/update/:id", isLoggedin, authorizeRoles("Admin"), updateMaterial);
router.delete("/delete/:id", isLoggedin, authorizeRoles("Admin"), deleteMaterial);
router.get("/hazardous", isLoggedin, authorizeRoles("Admin", "SafetyOfficer"), getHazardousMaterials);

module.exports = router;