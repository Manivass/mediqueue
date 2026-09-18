const validator = require("validator");
const validationSignup = ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new Error("all fields are required");
  }
  if (!validator.isEmail(email)) {
    throw new Error("email is not valid");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("password is not strong");
  }
};

module.exports = validationSignup;
