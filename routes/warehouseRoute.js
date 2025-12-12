const express = require("express");
const router = express.Router();

const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

const {
  createWarehouse,
  getAllWarehouses,
  getWarehouseById,
  updateWarehouse,
  deleteWarehouse,
} = require("../controllers/warehouseController");

// Only Admin + Manager can manage warehouses
router.post("/create", isLoggedin, authorizeRoles("Admin", "Manager"), createWarehouse);
router.get("/", isLoggedin, getAllWarehouses);
router.get("/:id", isLoggedin, getWarehouseById);
router.put("/:id", isLoggedin, authorizeRoles("Admin", "Manager"), updateWarehouse);
router.delete("/:id", isLoggedin, authorizeRoles("Admin"), deleteWarehouse);

module.exports = router;
