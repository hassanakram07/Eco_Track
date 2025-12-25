const User = require("../models/user-model");
const { createLog } = require("./logController");


exports.createEmployee = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phone, gender } = req.body;

    if (!firstName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "firstName, email, and password are required",
      });
    }

   
    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(400).json({
        success: false,
        message: "Employee with this email already exists",
      });
    }

    const employee = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || "Staff",
      phone,
      gender,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee,
    });
   } catch (err) {
    await createLog("ERROR", err.message, "Employee Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find().select("-password");

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (err) {
    await createLog("ERROR", err.message, "Employee Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await User.findById(id).select("-password");
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({ success: true, data: employee });
  } catch (err) {
    await createLog("ERROR", err.message, "Employee Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;


    if (req.body.role && req.user.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Only Admin can update roles",
      });
    }

    const employee = await User.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    ).select("-password");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Employee Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await User.findById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

   
    if (employee.role === "Admin") {
      return res.status(403).json({
        success: false,
        message: "Admin accounts cannot be deleted",
      });
    }

    await employee.deleteOne();

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Employee Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};
