const invoiceItemModel = require("../models/invoiceItem-model");
const invoiceModel = require("../models/invoice-model");
const { createLog } = require("../controllers/logController");


// ✅ 1. Invoice mein Items Add Karna (Admin/Finance Only)
exports.addInvoiceItems = async (req, res) => {
  try {
    const { items } = req.body; // Array of items expected

    // Items ko create karein aur unke IDs collect karein
    const createdItems = await invoiceItemModel.insertMany(items);
    const itemIds = createdItems.map(item => item._id);

    // Pehle item se invoiceId le kar main Invoice model ko update karein
    if (createdItems.length > 0) {
      await invoiceModel.findByIdAndUpdate(createdItems[0].invoiceId, {
        $push: { items: { $each: itemIds } }
      });
    }

    res.status(201).json({
      success: true,
      message: "Items added to invoice successfully",
      data: createdItems
    });
  } catch (err) {
    await createLog("ERROR", err.message, "Invoice Item Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2. Kisi Specific Invoice ke saare details/items dekhna
exports.getInvoiceDetails = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const items = await invoiceItemModel.find({ invoiceId });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (err) {
    await createLog("ERROR", err.message, "Invoice Item Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};