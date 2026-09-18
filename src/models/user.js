const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: function (value) {
        if (!validator.isEmail(value)) throw new Error("email is not valid");
      },
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      validate: function (value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("password is not strong");
        }
      },
    },

    phone: {
      type: String,
      trim: true,
      validate: function (value) {
        if (!validator.isMobilePhone(value)) {
          throw new Error("phone number is invalid");
        }
      },
    },

    role: {
      type: String,
      enum: ["PATIENT", "DOCTOR", "RECEPTIONIST", "ADMIN"],
      default: "PATIENT",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWTKey = async function () {
  const jwtToken = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });

  return jwtToken;
};

const User = new mongoose.model("User", userSchema);
module.exports = User;
