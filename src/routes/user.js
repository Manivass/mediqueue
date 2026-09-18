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

    const token = await user.getJWTKey();

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 3600 * 1000 * 24),
    });

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

user.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const isEmailAvailable = await User.findOne({ email });
    if (!isEmailAvailable) {
      return res
        .status(400)
        .json({ success: false, message: "invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      isEmailAvailable.password,
    );

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "invalid credentials" });
    }

    const token = await isEmailAvailable.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 100 * 60 * 60 * 24),
    });
    res.status(200).json({
      success: true,
      message: "successfully logged in",
      user: isEmailAvailable,
      token,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

user.post("/logout", async (req, res) => {
  try {
    res.cookie("token", "", { expires: new Date(0) });
    res.status(200).json({ success: true, messagae: "logout successfully" });
  } catch (err) {
    res.status(500).json({ success: false, messagae: err.messagae });
  }
});

module.exports = user;
