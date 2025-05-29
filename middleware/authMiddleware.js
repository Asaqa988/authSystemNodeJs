const jwt = require("jsonwebtoken");

const User = require("../models/User");

exports.authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.redirect("/login");

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decode.id);
    next();
  } catch (error) {
    res.redirect("/login");
  }
};


exports.isAdmin=(req,res,next)=>{
    if(req.user.role !== 'admin') return res.send("access denied")
        next(); 
}