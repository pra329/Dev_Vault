const express = require('express');
const userRouter = express.Router();
const { registerUser } = require('../controllers/user');
const { loginUser } = require('../controllers/user'); 
const { auth } = require('../middleware/auth');
const { currentUser } = require('../controllers/user');
const { changePassword } = require('../controllers/user');

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/me', auth, currentUser);
userRouter.patch('/me/password', auth, changePassword);

exports.userRouter = userRouter;