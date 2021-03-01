require("dotenv").config({ path: "./config/dev.env" });

const stripeAPI = require("stripe")(process.env.STRIPE_SECRET_KEY);

const calculateFinalAmount = (cartItems) => {
  return (
    cartItems.reduce((total, product) => {
      return total + product.price * product.count;
    }, 0) * 100
  );
};

exports.createPaymentIntent = async (req, res) => {
  const { cartItems, description, shippingAddress, receiptEmail } = req.body;
  try {
    const paymentIntent = await stripeAPI.paymentIntents.create({
      amount: calculateFinalAmount(cartItems),
      currency: "inr",
      description,
      payment_method_types: ["card"],
      receipt_email: receiptEmail,
      shipping: shippingAddress,
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ error: "an error occured, unable to create payment intent" });
  }
};
