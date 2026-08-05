const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

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

// Login User.
exports.loginUser = async(req, res, next) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: "email and password are required"
            })
        }
        const user = await User.findOne({email: email});
        if(!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }
        const passwordCheck = await bcrypt.compare(password, user.passwordHash);
        if(!passwordCheck) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }
        const token = jwt.sign(
            {
              userId: user._id,
              email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );
        return res.status(200).json({
            success: true,
            token,
            data: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    }
    catch(err) {
        return res.status(500).json({
            success: false,
            message: "Failed to login",
            error: err.message
        })
    }
}

// Return The Details Of Currently Logged In User.
exports.currentUser = async(req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("-passwordHash -__v").
    populate("starred", "title description language tags type");
    return res.status(200).json({
      success: true,
      data: user
    })
  }
  catch(err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch details of currently logged in user",
      error: err.message
    })
  }
}