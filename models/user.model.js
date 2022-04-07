const mongoose = require("mongoose");
const { v4: uuidV4 } = require("uuid");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    trim: true,
    required: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  userName: {
    type: String,
    trim: true,
    required: true,
  },
  hashed_password: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  salt: String,
  role: {
    type: Number,
    default: 0,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
  emailToken: {
    type: String,
    default: null,
  },
  emailTokenExpires: {
    type: String,
    default: null,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
});

/**
 * Virtual fields are additional fields for a given model.
 */

userSchema
  .virtual("password")
  .set(async function (password) {
    this._password = password;

    //generate a timestamp
    this.salt = uuidV4();

    //encrypting the password
    this.hashed_password = await this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema
  .virtual("confirmPassword")
  .set(function (confirm_password) {
    this._confirm_password = confirm_password;
  })
  .get(function () {
    return this.confirm_password;
  });

userSchema.methods = {
  authenticate: async function (plainText) {
    if (!plainText) return "";
    return (await this.encryptPassword(plainText)) === this.hashed_password;
  },
  encryptPassword: async function (password) {
    if (!password) return "";
    try {
      const firstHash = await crypto
        .createHmac("sha256", this.salt)
        .update(password)
        .digest("hex");
      return firstHash;
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = mongoose.model("User", userSchema);
