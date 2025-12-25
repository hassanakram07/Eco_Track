const roleModel = require("../models/role-model");
const { createLog } = require("../controllers/logController");


// ✅ 1. Naya Role Create Karna (SuperAdmin Only)
exports.createRole = async (req, res) => {
  try {
    const { name, description, permissions, isSystemRole } = req.body;

    const exist = await roleModel.findOne({ name });
    if (exist) return res.status(400).json({ success: false, message: "Role already exists" });

    const role = await roleModel.create({
      name,
      description,
      permissions, // Array of permission keys e.g. ["manage_users", "view_revenue"]
      isSystemRole,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Role created successfully",
      data: role
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Role Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2. Saare Roles dekhna (Dropdowns ke liye)
exports.getRoles = async (req, res) => {
  try {
    const roles = await roleModel.find({ status: "active" });
    res.status(200).json({ success: true, count: roles.length, data: roles });
    } catch (err) {
    await createLog("ERROR", err.message, "Role Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3. Role ki Permissions Update Karna
exports.updateRolePermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    const role = await roleModel.findByIdAndUpdate(
      id,
      { permissions, updatedAt: Date.now() },
      { new: true }
    );

    if (!role) return res.status(404).json({ success: false, message: "Role not found" });

    res.status(200).json({ success: true, message: "Permissions updated", data: role });
   } catch (err) {
    await createLog("ERROR", err.message, "Role Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};