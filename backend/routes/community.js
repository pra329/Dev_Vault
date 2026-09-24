const express = require('express');
const { getPublicSnippets } = require('../controllers/community');
const communityRouter = express.Router();

communityRouter.get('/community', getPublicSnippets);

exports.communityRouter = communityRouter;