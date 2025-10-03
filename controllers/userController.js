const userModel = require("../models/user-model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");

exports.registerUser = async (req, res) => {
  try {
    let {
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

    let userExist = await userModel.findOne({ email });
    if (userExist)
      return res
        .status(400)
        .json({ success: false, message: "User Already Registered" });

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) return res.send(err.message);
        else {
          let user = await userModel.create({
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
          await user.save();
          res.status(201).json({
            sucess: true,
            message: "User Registered Sucessfully",
            data: user,
          });
        }
      });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "server error" });
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
      let token = generateToken(user);
      res.cookie("token", token, { httpOnly: true });
      res
        .status(200)
        .json({ success: true, message: "User Login Successfully" });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Invalid Email or Password" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
