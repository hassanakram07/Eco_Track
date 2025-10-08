const userModel = require("../models/user-model")
function authorizeRoles(...roles) {
  return (req, res, next) => {
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied: You do not have permission to perform this action",
      });
    }

    
    next();
  };
}

module.exports = { authorizeRoles };
