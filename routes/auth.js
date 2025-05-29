const express = require("express");

const bycrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const router = express.Router();

const User = require("../models/User");

const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

// register for a new user

router.get("/register", (req, res) => res.render("register"));

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hash = await bycrypt.hash(password, 10);
  await User.create({ username, email, password: hash });
  res.redirect("/login");
});

// login logic

router.get("/login", (req, res) => res.render("login"));

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !bycrypt.compare(password, user.password))
    return res.send("invalid login");

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  res.cookie("token", token).redirect("/dashboard");
});

// dashboard

router.get("/dashboard", authMiddleware, (req, res) => {
  res.render("dashboard", { user: req.user });
});

// admin panel ( crud for the users )

// admin getting all users in admin page

router.get("/admin", authMiddleware, isAdmin, async (req, res) => {
  const users = await User.find();

  res.render("admin", { users });
});

router.post("/admin/add", authMiddleware, isAdmin, async (req, res) => {
  const { username, email, password, role } = req.body;
  const hash = await bycrypt.hash(password, 10);
  await User.create({ username, email, password: hash, role });
  res.redirect("/admin");
});

router.post("/admin/delete/:id", authMiddleware, isAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect("/admin");
});

router.post("/admin/update/:id", authMiddleware, isAdmin, async (req, res) => {
  const { username, email, role } = req.body;
  await User.findByIdAndUpdate(req.params.id, { username, email, role });
  res.redirect("/admin");
});

router.get("/logout",(req,res)=>{
res.clearCookie('token').redirect("/login")

})

module.exports = router;
