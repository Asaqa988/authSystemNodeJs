require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const cookieParser = require("cookie-parser");

const app = express();

const authRoutes = require("./routes/auth");

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDb is Connected");
});



app.set('view engine','ejs')

app.use(express.urlencoded({extended:true}))

app.use(cookieParser())

app.use("/",authRoutes)



app.listen(process.env.PORT, () => {
  console.log(`server is running on localhost port ${process.env.PORT} `);
});
