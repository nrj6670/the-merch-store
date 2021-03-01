const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ProductCartSchema = new mongoose.Schema({
  product: {
    type: ObjectId,
    ref: "Product",
  },
  name: String,
  count: Number,
  price: Number,
  size: String,
});

const ProductCart = mongoose.model("ProductCart", ProductCartSchema);

const orderScehma = new mongoose.Schema(
  {
    products: [ProductCartSchema],
    transaction_id: String,
    amount: { type: Number },
    address: {
      address_line: String,
      buyer: String,
      phone: String,
      email: String,
      city: String,
      pincode: String,
      state: String,
      country: String,
    },
    status: {
      type: String,
      default: "Received",
      enum: ["Cancelled", "Delivered", "Shipped", "Processing", "Received"],
    },
    updated: Date,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderScehma);

module.exports = {
  Order,
  ProductCart,
};
