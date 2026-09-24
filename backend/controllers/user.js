const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const AppError = require("../utils/appError");

// Register User To The Application.
exports.registerUser = async (req, res, next) => {
  try {
    const {name, email, password} = req.body;
    if (!name?.trim() || !email?.trim() || !password?.trim() || password.trim().length < 8) {
      return next(new AppError("All the fields are required and password must be at least 8 characters long", 400));
    }
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const isUserExist = await User.findOne({ email: trimmedEmail });
    if (isUserExist) {
      return next(new AppError("User alredy exist you want to register", 409));
    }
    const passwordHash = await bcrypt.hash(password.trim(), 10);
    const user = new User({name: trimmedName, email: trimmedEmail, passwordHash});
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
    return next(err);
  }
};

// Login User.
exports.loginUser = async(req, res, next) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return next(new AppError("email and password are required", 400));
        }
        const user = await User.findOne({email: email});
        if(!user) {
            return next(new AppError("User not found either invalid email", 401));
        }
        const passwordCheck = await bcrypt.compare(password, user.passwordHash);
        if(!passwordCheck) {
            return next(new AppError("Invalid password", 401));
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
        return next(err);
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
    return next(err);
  }
}

// Change Password
exports.changePassword = async(req, res, next) => {
  try {
    const userId = req.user.userId;
    const {currentPassword, newPassword} = req.body;
    const trimmedCurrentPassword = currentPassword?.trim();
    const trimmedNewPassword = newPassword?.trim();
    if(!trimmedCurrentPassword || !trimmedNewPassword || trimmedNewPassword.length < 8) {
      return next(
        new AppError("Current password and new password are required, and the new password must be at least 8 characters long",
          400
        )
      )
    }
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    const passwordCheck = await bcrypt.compare(trimmedCurrentPassword, user.passwordHash);
    if(!passwordCheck) {
      return next(new AppError("Invalid current password", 401));
    }
    const isSamePassword = await bcrypt.compare(trimmedNewPassword, user.passwordHash);
    if(isSamePassword) {
      return next(new AppError("New password can not be same as the old password", 400));
    }
    const passwordHash = await bcrypt.hash(trimmedNewPassword, 10);
    user.passwordHash = passwordHash;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Password updated successfully"
    })
  }
  catch(err) {
    return next(err);
  }
}