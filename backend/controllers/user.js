const User = require("../models/user");
const bcrypt = require("bcrypt");

// Register User To The Application.
exports.registerUser = async (req, res, next) => {
  try {
    const {name, email, password} = req.body;
    const isUserExist = await User.findOne({ email: email });
    if (isUserExist) {
      return res.status(409).json({
        success: false,
        message: "User alredy exist you want to register",
      });
    }
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All the fields are required",
      });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({name, email, passwordHash});
    const savedUser = await user.save();
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: err.message,
    });
  }
};