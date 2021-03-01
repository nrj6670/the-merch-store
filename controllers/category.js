const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Category not found in DB",
      });
    }

    req.category = category;
    next();
  });
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "NOT able to create category",
      });
    }

    return res.status(201).json(category);
  });
};

exports.getCategory = (req, res) => {
  return res.status(200).json(req.category);
};

exports.getAllCategory = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "NO category found",
      });
    }

    return res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  Category.findByIdAndUpdate(
    req.category._id,
    { $set: { name: req.body.name } },
    { new: true, useFindAndModify: false },
    (err, updatedCategory) => {
      if (err) {
        return res.status(400).json({
          error: "CANNOT update category",
        });
      }

      res.status(200).json(updatedCategory);
    }
  );
};

exports.deleteCategory = (req, res) => {
  Category.deleteOne({ _id: req.category._id }, (err, deletedCategory) => {
    if (err) {
      return res.status(400).json({
        error: "CANNOT delete category",
      });
    }

    return res.status(200).json(deletedCategory);
  });
};
