require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express(); // ✅ Declare app first
const authRoutes = require("./routes/auth");

// Middleware
app.use(express.urlencoded({ extended: true })); // for form POST
app.use(express.json()); // for raw JSON POST
app.use(cookieParser());
app.use(express.static("public")); // Optional: for serving CSS/images

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB is connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Set EJS as view engine
app.set("view engine", "ejs");

// Routes
app.use("/", authRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
