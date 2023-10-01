const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

module.exports = {
  createUser: async ({ userInput }, req) => {
    const errors = [];

    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: "E-mail is invalid." });
    }
    if (!validator.isLength(userInput.password, { min: 5 })) {
      errors.push({ message: "password too short" });
    }

    if (errors.length > 0) {
      const error = new Error("Invalid inputs.");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const existUser = await User.findOne({ email: userInput.email });

    if (existUser) {
      const error = new Error("User already exits");
      throw error;
    }

    const hashedPassword = await bcrypt.hash(userInput.password, 12);

    const user = new User({
      email: userInput.email,
      password: hashedPassword,
      name: userInput.name,
    });

    const createdUser = await user.save();

    return {
      ...createdUser._doc,
      _id: createdUser._id.toString(),
    };
  },
  login: async ({ email, password }, req) => {
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User not exits");
      error.code = 401;
      throw error;
    }

    const isVerified = await bcrypt.compare(password, user.password);

    if (!isVerified) {
      const error = new Error("Password is incorrect");
      error.code = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      "secretkey",
      {
        expiresIn: "1h",
      }
    );

    return {
      token,
      userId: user._id.toString(),
    };
  },
};
