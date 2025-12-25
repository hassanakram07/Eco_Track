const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");
const roleModel = require("../models/role-model"); // Role check karne ke liye
const sessionModel = require("../models/session-model"); // Session verify karne ke liye

const isLoggedin = async (req, res, next) => {
  try {
    // 1. Token nikalna (Cookies ya Headers se)
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({ success: false, message: "You Need To Login First" });
    }

    // 2. JWT Token ko verify karna
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // ⭐️ 3. SESSION CHECK (Security Layer)
    // Hum database mein check kar rahe hain ke kahin ye session block (revoke) toh nahi kar diya gaya
    const activeSession = await sessionModel.findOne({ jwtToken: token, revoked: false });

    if (!activeSession) {
      return res.status(401).json({
        success: false,
        message: "Session has been revoked or expired. Please login again."
      });
    }

    // 4. User ka data nikalna (Password ke baghair)
    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "User Not Found" });
    }

    // Request object mein user set karna taake aage controllers use kar saken
    req.user = user;
    // console.log("DEBUG: Auth Middleware Success. User:", user.email, "Role:", user.role);
    return next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(400).json({ success: false, message: "Invalid or expired token" });
  }
};

// ⭐️ 5. Permissions Check karne wala function
const authorizePermissions = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const userRole = await roleModel.findOne({ name: req.user.role });

      if (!userRole || !userRole.permissions.includes(requiredPermission)) {
        return res.status(403).json({
          success: false,
          message: `Forbidden: You do not have '${requiredPermission}' permission.`
        });
      }
      next();
    } catch (err) {
      res.status(500).json({ success: false, message: "Permission check failed" });
    }
  };
};

// Dono functions ko export kar diya
module.exports = { isLoggedin, authorizePermissions };