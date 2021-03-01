const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const { signout, signup, signin, isSignedIn } = require("../controllers/auth");

//validation middlewares
const { passwordValidator } = require("../middlewares/validators");

router.post("/signup", signup);

router.post("/signin", signin);

router.get("/signout", signout);

module.exports = router;
