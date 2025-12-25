const userModel = require("../models/user-model")
function authorizeRoles(...roles) {
  return (req, res, next) => {

    console.log(`DEBUG: Role Check. User Role: '${req.user.role}', Allowed:`, roles);
    if (!roles.includes(req.user.role)) {
      console.log("DEBUG: Role Check Failed.");
      return res.status(403).json({
        success: false,
        message: "Access denied: You do not have permission to perform this action",
      });
    }


    next();
  };
}

module.exports = { authorizeRoles };
