const express = require("express");
const router = express.Router();
const { 
    createSection, 
    getSectionsByWarehouse, 
    updateSectionLoad,
    deleteSection 
} = require("../controllers/sectionController");

const { isLoggedin, authorizePermissions } = require("../middleware/isLoggedin");

// 1. Naya Section Banane ke liye
// POST /api/sections/create
router.post(
    "/create", 
    isLoggedin, 
    authorizePermissions("manage_warehouse"), 
    createSection
);

// 2. Kisi specific Warehouse ke saare sections dekhne ke liye
// GET /api/sections/warehouse/:warehouseId
router.get(
    "/warehouse/:warehouseId", 
    isLoggedin, 
    getSectionsByWarehouse
);

// 3. Section ka load (wazan) update karne ke liye
// PUT /api/sections/update-load
router.put(
    "/update-load", 
    isLoggedin, 
    authorizePermissions("update_stock"), 
    updateSectionLoad
);

module.exports = router;