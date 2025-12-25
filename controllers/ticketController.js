const ticketModel = require("../models/supportTicket-model");
const { createLog } = require("../controllers/logController");


// ✅ 1. CREATE TICKET (Customer/User)
exports.createTicket = async (req, res) => {
  try {
    const { subject, message, priority, attachments } = req.body;

    // Unique Ticket Number Generator (e.g. TKT-1734530000)
    const ticketNumber = `TKT-${Date.now()}`;

    const ticket = await ticketModel.create({
      ticketNumber,
      userId: req.user._id,
      subject,
      message,
      priority,
      attachments
    });

    res.status(201).json({ success: true, message: "Support ticket raised successfully", data: ticket });
  } catch (err) {
    await createLog("ERROR", err.message, "Ticket Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2. GET MY TICKETS (User Dashboard)
exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await ticketModel.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tickets });
  } catch (err) {
    await createLog("ERROR", err.message, "Ticket Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3. ASSIGN & UPDATE TICKET (Admin/Staff Only)
exports.updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTo, priority } = req.body;

    const ticket = await ticketModel.findByIdAndUpdate(
      id,
      { status, assignedTo, priority, updatedAt: Date.now() },
      { new: true }
    );

    if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });

    res.status(200).json({ success: true, message: "Ticket updated successfully", data: ticket });
    } catch (err) {
    await createLog("ERROR", err.message, "Ticket Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};