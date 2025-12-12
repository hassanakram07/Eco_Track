
const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

const isLoggedin = async (req, res, next) => {
  try {

    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({ success: false, message: "You Need To Login First" });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
   

    
    const user = await userModel.findById(decoded.id).select("-password");


    if (!user) {
      return res.status(401).json({ success: false, message: "User Not Found" });
    }

    req.user = user; 
    return next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(400).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = { isLoggedin };
