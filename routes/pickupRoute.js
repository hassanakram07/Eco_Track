const express = require("express");
const router = express.Router();

const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");
const {
  createpickupRequest,
  getMyPickups,
  getAllPickups,
  assignCollector,
  updatePickupStatus,
} = require("../controllers/pickupController");

router.post(
  "/create",
  isLoggedin,
  authorizeRoles("Customer", "Admin", "Manager"),
  createpickupRequest
);
router.get("/my", isLoggedin, authorizeRoles("Customer", "Admin", "Manager"), getMyPickups);

router.get("/", isLoggedin, authorizeRoles("Admin", "Manager"), getAllPickups);
router.patch("/assign/:id", isLoggedin, authorizeRoles("Admin"), assignCollector);
router.patch("/admin/:id", isLoggedin, authorizeRoles("Admin", "Manager"), require("../controllers/pickupController").adminProcessPickup);

router.put(
  "/status/:id",
  isLoggedin,
  authorizeRoles("Collector"),
  updatePickupStatus
);

module.exports = router;


