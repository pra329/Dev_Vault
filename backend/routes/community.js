const express = require('express');
const { getPublicSnippets } = require('../controllers/community');
const {toggleLike} = require('../controllers/community');
const communityRouter = express.Router();
const {auth} = require('../middleware/auth');

communityRouter.get('/community', getPublicSnippets);
communityRouter.post('/snippets/:id/like', auth, toggleLike);

exports.communityRouter = communityRouter;