const express = require("express");
const router = express.Router();
const { 
    createWarehouse, 
    getAllWarehouses, 
    getWarehouseById, 
    updateWarehouseStock, // Naya function
    updateWarehouse, 
    deleteWarehouse 
} = require("../controllers/warehouseController");

const { isLoggedin, authorizePermissions } = require("../middleware/isLoggedin");

// 🔒 Admin/Manager: Naya warehouse banane ke liye
router.post("/create", isLoggedin, authorizePermissions("manage_warehouse"), createWarehouse);

// 🔒 Inventory Manager: Stock jama ya nikaalne ke liye
router.post("/update-stock", isLoggedin, authorizePermissions("update_stock"), updateWarehouseStock);

// 🔓 Sab logged-in users dekh sakte hain
router.get("/all", isLoggedin, getAllWarehouses);
router.get("/:id", isLoggedin, getWarehouseById);

// 🔒 Admin: Edit ya Delete karne ke liye
router.put("/update/:id", isLoggedin, authorizePermissions("manage_warehouse"), updateWarehouse);
router.delete("/delete/:id", isLoggedin, authorizePermissions("manage_warehouse"), deleteWarehouse);

module.exports = router;