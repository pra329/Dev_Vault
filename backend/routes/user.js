const express = require('express');
const userRouter = express.Router();
const { registerUser } = require('../controllers/user');

userRouter.post('/register', registerUser);

exports.userRouter = userRouter;