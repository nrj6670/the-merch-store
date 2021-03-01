require("dotenv").config({ path: "./config/dev.env" });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { v1: uuidv1 } = require("uuid");

exports.makepayment = (req, res) => {
  const { products, token } = req.body;

  let amount = 0;

  products.map((product) => {
    amount += product.count * product.price;
  });

  const idempotencyKey = uuidv1();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges
        .create(
          {
            amount: amount * 100,
            currency: "inr",
            customer: customer.id,
            receipt_email: token.email,
            shipping: {
              name: token.card.name,
              address: {
                line1: token.card.address_line1,
                line2: token.card.address_line2,
                city: token.card.address_city,
                country: token.card.address_country,
                postal_code: token.card.address_zip,
              },
            },
          },
          { idempotencyKey }
        )
        .then((result) => {
          return res.status(200).json(result);
        })
        .catch((err) => console.log(err));
    });
};

// exports.makepayment = async (req, res) => {
//   const { products, customerEmail } = req.body;

//   if (!products || !customerEmail) {
//     return res.status(400).json({ error: "missing some required parameters" });
//   }

//   let amount = 0;

//   products.map((product) => {
//     amount += product.count * product.price;
//   });

//   let line_items = [];
//   products.forEach((product) => {
//     console.log(product.photo);
//     line_items.push({
//       quantity: product.count,
//       price_data: {
//         currency: "inr",
//         unit_amount: product.count * product.price * 100,
//         product_data: {
//           name: product.name,
//           description: product.description,
//           images: product.photo,
//         },
//       },
//     });
//   });

//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       line_items: line_items,
//       shipping_address_collection: { allowed_countries: ["IN"] },
//       customer_email: customerEmail,
//       success_url: "http://localhost:3000/success/{CHECKOUT_SESSION_ID}",
//       cancel_url: "http://localhost:3000/",
//     });
//     res.send({ message: "successful", sessionId: session.id });
//   } catch (error) {
//     console.log(error);
//     res
//       .status(400)
//       .json({ error: "an error occured, unable to create session" });
//   }
// };
