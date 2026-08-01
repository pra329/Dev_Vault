const express = require('express');
const userRouter = express.Router();
const { registerUser } = require('../controllers/user');
const { loginUser } = require('../controllers/user'); 

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

exports.userRouter = userRouter;