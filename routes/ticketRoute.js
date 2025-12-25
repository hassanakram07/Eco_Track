const express = require("express");
const router = express.Router();
const { 
  createTicket, 
  getMyTickets, 
  updateTicketStatus 
} = require("../controllers/ticketController");

const { isLoggedin, authorizePermissions } = require("../middleware/isLoggedin");

// 🔓 Logged-in Users: Ticket raise karne ke liye
router.post("/raise", isLoggedin, createTicket);

// 🔓 User: Apne tickets dekhne ke liye
router.get("/my-tickets", isLoggedin, getMyTickets);

// 🔒 Support Staff/Admin: Ticket manage karne ke liye
router.put(
  "/manage/:id", 
  isLoggedin, 
  authorizePermissions("manage_support_tickets"), 
  updateTicketStatus
);

// 🔒 Admin: Saare tickets dekhne ke liye
router.get(
  "/all", 
  isLoggedin, 
  authorizePermissions("view_all_tickets"), 
  async (req, res) => {
    const tickets = await ticketModel.find().populate("userId", "firstName lastName");
    res.json({ success: true, data: tickets });
  }
);

module.exports = router;