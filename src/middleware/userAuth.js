const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token)
      return res.status(400).json({ success: false, message: "please login" });

    const { _id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(_id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    req.user = user;
    next();
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
