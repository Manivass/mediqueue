const express = require("express");
const validationSignup = require("../validation/signup");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const user = express.Router();

user.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. fields
    validationSignup(req.body);

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // 5. Send response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = user;
