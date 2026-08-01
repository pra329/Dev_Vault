const express = require('express');
const userRouter = express.Router();
const { registerUser } = require('../controllers/user');

userRouter.post('/user', registerUser);

exports.userRouter = userRouter;