const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const sharp = require("sharp");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "CANNOT find product",
        });
      }
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Error with image",
      });
    }

    const { name, price, description, stock, category } = fields;

    if (!name || !price || !description || !stock || !category) {
      return res.status(400).json({
        error: "Please include all the fields",
      });
    }

    const product = new Product(fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 7000000) {
        return res.status(400).json({
          error: "File size too big. It should be less than 2MB.",
        });
      }

      const buffer = await sharp(fs.readFileSync(file.photo.path))
        .resize({ width: 1280, height: 1020 })
        .png()
        .toBuffer();
      product.photo.data = buffer;
      product.photo.contentType = file.photo.type;
    }

    //save to the DB
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "saving product into DB FAILED",
        });
      }

      res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.status(200).json(req.product);
};

exports.deleteProduct = (req, res) => {
  const product = req.product;
  Product.findByIdAndDelete(product._id, (err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "product deletion failed",
      });
    }

    res.status(200).json({
      message: "Deletion was a success",
      deletedProduct,
    });
  });
};

exports.getAllProducts = (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 8;
  const sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    .select("-photo")
    .populate("category")
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "No product found",
        });
      }

      return res.status(200).json(products);
    });
};

exports.updateStock = (req, res, next) => {
  const myOperations = req.body.order.products.map((product) => {
    return {
      updateOne: {
        filter: { _id: product._id },
        update: { $inc: { stock: -product.count, sold: +product.count } },
      },
    };
  });

  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk opreation failed",
      });
    }
    next();
  });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "NO category found",
      });
    }

    return res.status(200).json(categories);
  });
};

//middleware
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.updateProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Error with image",
      });
    }

    //updating existing product using new fields

    const product = _.extend(req.product, fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 7000000) {
        return res.status(400).json({
          error: "File size too big. It should be less than 2MB.",
        });
      }

      // product.photo.data = fs.readFileSync(file.photo.path);
      const buffer = await sharp(fs.readFileSync(file.photo.path))
        .resize({ width: 1280, height: 1020 })
        .png()
        .toBuffer();
      product.photo.data = buffer;
      product.photo.contentType = file.photo.type;
    }
    //save to the DB
    product.save((err, updatedProduct) => {
      if (err) {
        return res.status(400).json({
          error: "Updation of product failed",
        });
      }
      return res.status(200).json({
        message: "Product updation was a success",
        updatedProduct,
      });
    });
  });
};
