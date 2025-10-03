const jwt = require("jsonwebtoken");

const userModel = require("../models/user-model");

module.exports = async (req, res, next) => {
  try {
    const token = req.cookie?.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "You Need To Login First" });
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const user = await userModel
      .findOne({ email: decoded.email })
      .select(-password);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User Not Found" });
    }
    return next();
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
