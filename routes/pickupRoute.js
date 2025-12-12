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
  authorizeRoles("Customer"),
  createpickupRequest
);
router.get("/my", isLoggedin, authorizeRoles("Customer"), getMyPickups);

router.get("/", isLoggedin, authorizeRoles("Admin", "Manager"), getAllPickups);
router.put("/assign/:id", isLoggedin, authorizeRoles("Admin"), assignCollector);

router.put(
  "/status/:id",
  isLoggedin,
  authorizeRoles("Collector"),
  updatePickupStatus
);

module.exports = router;


