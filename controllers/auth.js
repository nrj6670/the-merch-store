const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
require("dotenv").config({ path: "./config/dev.env" });

//model
const User = require("../models/user");
const { body, validationResult } = require("express-validator");

exports.signup = (req, res) => {
  // const errors = validationResult(req);
  // if (errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }
  console.log(req.body);
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      console.log(err);
      return res.status(409).json({
        error: "Duplicate key exists",
      });
    }

    res.status(201).json(user);
  });
};

// exports.signin = (req, res) => {
//   res.send("Signing in...");
// };

exports.signin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err) {
      return res.status(401).json({
        error: "Error occured",
      });
    }

    if (!user) {
      return res.status(401).json({
        error: "user not found",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "email/password doesn't match",
      });
    }

    //creating token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);

    //put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    //send response to front-end
    return res.status(200).json({ token, user });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout successfully",
  });
};

//protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
  algorithms: ["HS256"],
});

exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;

  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not ADMIN, ACCESS DENIED",
    });
  }
  next();
};
