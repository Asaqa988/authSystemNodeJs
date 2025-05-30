const express = require("express");
const bcrypt = require("bcryptjs"); // ✅ fixed typo
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

// GET register page
router.get("/register", (req, res) => res.render("register"));

// POST register
router.post("/register", async (req, res) => {
  try {

    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.send("Email already registered.");

    const hash = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hash });

    res.redirect("/login");
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET login page
router.get("/login", (req, res) => res.render("login"));

// POST login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.send("Invalid login");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.cookie("token", token).redirect("/dashboard");
  } catch (err) {
    res.status(500).send("Login error");
  }
});

// GET dashboard
router.get("/dashboard", authMiddleware, (req, res) => {
  res.render("dashboard", { user: req.user });
});

// Admin Panel: List users
router.get("/admin", authMiddleware, isAdmin, async (req, res) => {
  const users = await User.find();
  res.render("admin", { users });
});

// Admin: Add user
router.post("/admin/add", authMiddleware, isAdmin, async (req, res) => {
  const { username, email, password, role } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await User.create({ username, email, password: hash, role });
  res.redirect("/admin");
});

// Admin: Delete user
router.post("/admin/delete/:id", authMiddleware, isAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect("/admin");
});

// Admin: Update user
router.post("/admin/update/:id", authMiddleware, isAdmin, async (req, res) => {
  const { username, email, role } = req.body;
  await User.findByIdAndUpdate(req.params.id, { username, email, role });
  res.redirect("/admin");
});

// Logout
router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/login");
});

module.exports = router;
