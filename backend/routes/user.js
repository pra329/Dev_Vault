const express = require('express');
const userRouter = express.Router();
const { postUser } = require('../controllers/user');

userRouter.post('/user', postUser);

exports.userRouter = userRouter;