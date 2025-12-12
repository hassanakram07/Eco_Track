const express = require("express");
const router = express.Router();
const {
  addInventory,
  updateInventory,
  deleteInventory,
} = require("../controllers/inventoryController");
const{ isLoggedin} = require("../middleware/isLoggedin");
const {authorizeRoles} = require("../middleware/authorizeRoles");

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
module.exports = router;