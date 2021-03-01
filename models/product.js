const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 32,
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
    stock: {
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    likes: {
      type: Number,
    },
    dislikes: {
      type: Number,
    },
    sizes: Array,
  },
  { timestamps: true }
);

productSchema.methods.toJSON = function () {
  const product = this;

  const temp = product.toObject();

  delete temp.photo;

  return temp;
};

module.exports = mongoose.model("Product", productSchema);
