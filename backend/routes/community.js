const express = require('express');
const { getPublicSnippets } = require('../controllers/community');
const { toggleLike } = require('../controllers/community');
const { toggleStar } =  require('../controllers/community');
const {auth} = require('../middleware/auth');
const communityRouter = express.Router();

communityRouter.get('/community', getPublicSnippets);
communityRouter.post('/snippets/:id/like', auth, toggleLike);
communityRouter.post('/snippets/:id/star', auth, toggleStar);

exports.communityRouter = communityRouter;