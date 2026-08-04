const express = require('express');
const collectionRouter = express.Router();
const { postCollection } = require('../controllers/collection');
const { getCollections } = require('../controllers/collection');
const { getCollectionByIdWithSnippets } = require('../controllers/collection');
const { updateCollection } = require('../controllers/collection');
const { deleteCollection } = require('../controllers/collection');
const { auth } = require('../middleware/auth');

collectionRouter.post("/collections", auth, postCollection);
collectionRouter.get("/collections", auth, getCollections);
collectionRouter.get("/collections/:id", auth, getCollectionByIdWithSnippets);
collectionRouter.patch("/collections/:id", auth, updateCollection);
collectionRouter.delete("/collections/:id", auth, deleteCollection);

exports.collectionRouter = collectionRouter;