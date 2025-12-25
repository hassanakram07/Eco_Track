const orderItemModel = require("../models/orderItem-model");
const orderModel = require("../models/order-model");
const productModel = require("../models/product-model");
const { createLog } = require("../controllers/logController");


// ✅ 1. Order mein Items Add Karna aur Stock Update Karna
exports.addOrderItems = async (req, res) => {
  try {
    const { items } = req.body; // Array of objects

    // Items ko database mein save karein
    const createdItems = await orderItemModel.insertMany(items);
    const itemIds = createdItems.map(item => item._id);

    // Main Order model ko update karein (Item IDs array mein push karein)
    if (createdItems.length > 0) {
      const orderId = createdItems[0].orderId;
      await orderModel.findByIdAndUpdate(orderId, {
        $push: { items: { $each: itemIds } }
      });

      // Industrial Logic: Stock update karein har product ka
      for (const item of createdItems) {
        await productModel.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity }
        });
      }
    }

    res.status(201).json({
      success: true,
      message: "Items added to order and stock updated successfully",
      data: createdItems
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Order Item Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2. Kisi Specific Order ke saare items fetch karna
exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const items = await orderItemModel.find({ orderId }).populate("productId", "name sku images");

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Order Item Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};