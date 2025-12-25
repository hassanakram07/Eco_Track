const userModel = require("../models/user-model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");
// 1. Session Controller se function import kiya
const { createSession } = require("./sessionController");
const { createLog } = require("../controllers/logController");


exports.registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
      city,
      role,
      country,
      postalCode,
    } = req.body;

    const userExist = await userModel.findOne({ email });
    if (userExist)
      return res
        .status(400)
        .json({ success: false, message: "User Already Registered" });

    // Password hashing
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      firstName,
      lastName,
      email,
      password: hash,
      phone,
      address,
      city,
      role,
      country,
      postalCode,
    });

    res.status(201).json({
      success: true, // Fixed spelling from 'sucess' to 'success'
      message: "User Registered Successfully",
      data: user,
    });
  } catch (err) {
    await createLog("ERROR", err.message, "User Module", {
      stack: err.stack,
      inputData: req.body,
      user: req.user ? req.user._id : "Guest"
    });
    console.error("Register Error:", err);
    res.status(500).json({ success: false, message: "Server error during registration" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email });

    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "User Not Found" });

    let isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // 2. Token generate karein
      let token = generateToken(user);

      // ⭐️ 3. SESSION LOGIC: Database mein session record karna
      // Is se security barh jati hai aur hum remote logout kar sakte hain
      await createSession({
        userId: user._id,
        jwtToken: token,
        ipAddress: req.ip || req.headers['x-forwarded-for'] || "127.0.0.1",
        userAgent: req.headers["user-agent"],
        // Session 24 ghante baad expire hoga
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        deviceInfo: {
          browser: req.headers["user-agent"],
          platform: req.headers["sec-ch-ua-platform"] || "Unknown Device"
        }
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Production mein secure cookie
        maxAge: 24 * 60 * 60 * 1000
      });

      res.status(200).json({
        success: true,
        message: "User Login Successfully",
        token,
        user
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid Email or Password" });
    }
  } catch (err) {
    await createLog("ERROR", err.message, "User Module", {
      stack: err.stack,
      inputData: req.body,
      user: req.user ? req.user._id : "Guest"
    });
    console.error("Login Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};