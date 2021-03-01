const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuidv1, validate } = require("uuid");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },
    lastname: {
      type: String,
      trim: true,
      maxlength: 32,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    encry_password: {
      type: String,
      required: true,
    },
    salt: String,
    role: {
      type: Number,
      default: 0,
    },
    purchases: {
      type: Array,
      default: [],
    },
    addresses: {
      type: Array,
      default: [],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    avatar: {
      type: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainPassword) {
    return this.securePassword(plainPassword) === this.encry_password;
  },
  securePassword: function (plainPassword) {
    if (!plainPassword) {
      return "";
    }

    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainPassword)
        .digest("hex");
    } catch (e) {
      return "";
    }
  },
  toJSON: function () {
    const user = this;
    const tempUser = user.toObject();
    delete tempUser.encry_password;
    delete tempUser.salt;

    return tempUser;
  },
};

module.exports = mongoose.model("User", userSchema);
