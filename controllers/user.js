const User = require("../models/user");
const Order = require("../models/order");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found in DB",
      });
    }

    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  return res.json(req.profile);
};

exports.getAllUser = (req, res) => {
  User.find().exec((err, users) => {
    if (err || !users) {
      return res.status(400).json({
        error: "Cannot fetch users from DB",
      });
    }

    return res.status(200).json(users);
  });
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "You are not authorized to update this user",
        });
      }

      res.json(user);
    }
  );
};

exports.userParchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({ error: "No order in this account" });
      }

      return res.json(order);
    });
};

exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = [];
  req.body.order.products.forEach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      size: product.size,
      category: product.category,
      quantity: product.count,
      amount: product.count * product.price,
      transaction_id: req.body.order.transaction_id,
    });
  });

  //pushing purchase list in the database

  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } },
    { new: true },
    (err, purchases) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to save purchase list",
        });
      }
      next();
    }
  );
};

//add address
exports.addAddress = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { addresses: req.body.address } },
    { new: true },
    (error, user) => {
      if (error || !user) {
        return res.status(400).json({
          error: "Cannot add address",
        });
      }

      return res.status(200).json(user);
    }
  );
};
