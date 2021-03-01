const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParse = require("cookie-parser");
const cors = require("cors");

//database connection
require("./db/mongoose");

//port configuration
const port = process.env.PORT || 8000;

const app = express();

//importing my routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const stripeRoutes = require("./routes/stripepayment");

//3rd party middleware configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParse());
app.use(cors({ origin: true }));

//setting up routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", stripeRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client-side/build"));
  app.get(
    "/*",
    (next) => {
      console.log("inside here");
      next();
    },
    (req, res) => {
      req.sendFile(path.resolve(__dirname, "client-side/build/index.html"));
    }
  );
}
//starting the app
app.listen(port, () => {
  console.log(`server is up and running on port ${port}`);
});
