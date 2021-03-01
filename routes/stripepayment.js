const express = require("express");
const router = express.Router();

//controller
const { makepayment } = require("../controllers/stripepayment");
const { createPaymentIntent } = require("../controllers/stripePaymentIntent");

router.post("/stripepayment", makepayment);
router.post("/createPaymentIntent", createPaymentIntent);

module.exports = router;
