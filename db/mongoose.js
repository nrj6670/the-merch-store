require("dotenv").config({ path: "./config/dev.env" });
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DATABASE CONNECTED"))
  .catch(() => console.log("DATABASE CONNECTION FAILED"));
