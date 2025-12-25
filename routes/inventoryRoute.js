const express = require("express");
const router = express.Router();
const {
  addInventory,
  updateInventory,
  deleteInventory,
} = require("../controllers/inventoryController");
const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

router.post(
  "/add",
  isLoggedin,
  authorizeRoles("Admin", "Manager"),
  addInventory
);
router.patch(
  "/update/:id",
  isLoggedin,
  authorizeRoles("Admin", "Manager"),
  updateInventory
);
router.delete(
  "/delete/:id",
  isLoggedin,
  authorizeRoles("Admin", "Manager"),
  deleteInventory
);

router.get(
  "/",
  isLoggedin,
  // Accessible by all authenticated staff
  // authorizeRoles("Admin", "Manager", "Staff"), 
  function (req, res, next) {
    // Temporary: Allow all roles to verify dashboard. 
    // Ideally should check roles but 'isLoggedin' is enough for dashboard
    next();
  },
  require("../controllers/inventoryController").getInventory
);

module.exports = router;