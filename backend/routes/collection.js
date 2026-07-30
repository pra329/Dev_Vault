const express = require('express');
const collectionRouter = express.Router();
const { postCollection } = require('../controllers/collection');
const { getCollections } = require('../controllers/collection');
const { getCollectionByIdWithSnippets } = require('../controllers/collection');
const { updateCollection } = require('../controllers/collection');
const { deleteCollection } = require('../controllers/collection');

collectionRouter.post("/collections", postCollection);
collectionRouter.get("/collections", getCollections);
collectionRouter.get("/collections/:id", getCollectionByIdWithSnippets);
collectionRouter.patch("/collections/:id", updateCollection);
collectionRouter.delete("/collections/:id", deleteCollection);

exports.collectionRouter = collectionRouter;