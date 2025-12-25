const permissionModel = require("../models/permission-model");
const { createLog } = require("../controllers/logController");


// ✅ 1. Nayi Permission Register Karna (SuperAdmin Only)
exports.createPermission = async (req, res) => {
  try {
    const { key, name, description, module, metadata } = req.body;

    // Key format check (e.g., manage_users)
    const exist = await permissionModel.findOne({ key });
    if (exist) return res.status(400).json({ success: false, message: "Permission key already exists" });

    const permission = await permissionModel.create({
      key,
      name,
      description,
      module,
      metadata
    });

    res.status(201).json({
      success: true,
      message: "Permission registered successfully",
      data: permission
    });
  } catch (err) {
    await createLog("ERROR", err.message, "Permission Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2. Saari Permissions dekhna (Roles assign karne ke liye)
exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await permissionModel.find({ deprecated: false });
    res.status(200).json({
      success: true,
      count: permissions.length,
      data: permissions
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Permission Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3. Module ke mutabik permissions dekhna (e.g., 'Inventory' module ki permissions)
exports.getPermissionsByModule = async (req, res) => {
  try {
    const { moduleName } = req.params;
    const permissions = await permissionModel.find({ module: moduleName });
    res.status(200).json({ success: true, data: permissions });
  } catch (err) {
    await createLog("ERROR", err.message, "Permission Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 4. Permission Update/Deprecate Karna
exports.updatePermission = async (req, res) => {
  try {
    const permission = await permissionModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!permission) return res.status(404).json({ success: false, message: "Permission not found" });

    res.status(200).json({ success: true, message: "Permission updated", data: permission });
    } catch (err) {
    await createLog("ERROR", err.message, "Permission Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};