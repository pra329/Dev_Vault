const express = require('express');
const collectionRouter = express.Router();
const { postCollection } = require('../controllers/collection');

collectionRouter.post("/collections", postCollection);

exports.collectionRouter = collectionRouter;