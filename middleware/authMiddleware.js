const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes for authenticated users
exports.authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.redirect("/login");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.redirect("/login");

    req.user = user;
    next();
  } catch (error) {
    res.redirect("/login");
  }
};

// Restrict to admins only
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).send("Access denied");
  }
  next();
};
