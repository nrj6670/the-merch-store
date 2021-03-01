const { Order, ProductCart } = require("../models/order");

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("user", "_id name lastname email phone")
    .exec((err, order) => {
      if (err || !order) {
        return res.status(400).json({
          error: "No order found",
        });
      }
      req.order = order;
      next();
    });
};

exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);

  order.save((err, savedOrder) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to save order in DB",
      });
    }
    res.json(savedOrder);
  });
};

exports.getAllOrder = (req, res) => {
  Order.find()
    .populate("user", "_id name lastname email phone")
    .exec((err, orders) => {
      if (err || !orders) {
        return res.status(400).json({
          error: "NO order found in DB",
        });
      }
      res.json(orders);
    });
};

exports.getOrderStatus = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

exports.updateStatus = (req, res) => {
  Order.findByIdAndUpdate(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, order) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          error: "Cannot update order status",
        });
      }
      res.status(200).json(order);
    }
  );
};

exports.getOrder = (req, res) => {
  req.order.createdAt = new Date(req.order.createdAt);
  return res.status(200).json(req.order);
};

//get user's all orders
exports.getAllUserOrders = (req, res) => {
  Order.find({ user: req.profile._id }).exec((error, orders) => {
    if (error) {
      return res.status(400).json({
        error: "Error finding orders",
      });
    }
    return res.status(200).json(orders);
  });
};
