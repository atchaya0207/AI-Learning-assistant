// middleware/auth.js
const jwt  = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  console.log("Authorization Header:", req.headers.authorization);
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer"))
    return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(auth.split(" ")[1], process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch(err) {
    console.log("JWT Error:", err.message);
    res.status(401).json({ error: "Token invalid or expired" });
  }
};

module.exports = { protect };
