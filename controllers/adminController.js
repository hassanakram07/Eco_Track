const adminModel = require("../models/admin-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createLog } = require("./logController");

exports.registerAdmin = async (req, res) => {
  try {
    const { username, password, fullName, email, phone, role, permissions } = req.body;

    const adminExist = await adminModel.findOne({ $or: [{ username }, { email }] });
    if (adminExist) return res.status(400).json({ success: false, message: "Admin already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await adminModel.create({
      username,
      password: hashedPassword,
      fullName,
      email,
      phone,
      role,
      permissions
    });

    res.status(201).json({ success: true, message: "Admin Created", data: admin });
 } catch (err) {
    
    await createLog("ERROR", err.message, "Admin Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await adminModel.findOne({ username });

    if (!admin) return res.status(401).json({ success: false, message: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid Credentials" });

    
    admin.lastLogin = Date.now();
    await admin.save();

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_KEY, { expiresIn: "1d" });

    res.cookie("adminToken", token, { httpOnly: true });
    res.status(200).json({ success: true, message: `Welcome ${admin.fullName}`, token });
  } catch (err) {
   
    await createLog("ERROR", err.message, "Admin Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await adminModel.find().select("-password");
    res.status(200).json({ success: true, data: admins });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};