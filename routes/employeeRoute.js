const express = require("express");
const router = express.Router();

const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

// Admin can create employees
router.post(
  "/create",
  isLoggedin,
  authorizeRoles("Admin"),
  createEmployee
);

// Everyone logged in can view employees
router.get("/", isLoggedin, getAllEmployees);

router.get("/:id", isLoggedin, getEmployeeById);

// Admin & Manager can update employees
router.put(
  "/:id",
  isLoggedin,
  authorizeRoles("Admin", "Manager"),
  updateEmployee
);

// Only Admin can delete employees
router.delete(
  "/:id",
  isLoggedin,
  authorizeRoles("Admin"),
  deleteEmployee
);

module.exports = router;
