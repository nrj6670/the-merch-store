const express = require("express");
const router = express.Router();

//controllers
const {
  getUserById,
  getUser,
  getAllUser,
  updateUser,
  userParchaseList,
  addAddress,
} = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

router.param("userId", getUserById);

router.get("/users", getAllUser);

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);
router.put("/user/address/:userId", isSignedIn, isAuthenticated, addAddress);
router.get("order/user/:userId", isSignedIn, isAuthenticated, userParchaseList);

module.exports = router;
