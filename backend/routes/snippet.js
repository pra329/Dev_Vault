const express = require('express');
const snippetRouter = express.Router();
const { getSnippet } = require('../controllers/snippet');
const { postSnippet } = require('../controllers/snippet'); 

snippetRouter.get('/snippets',getSnippet);
snippetRouter.post('/snippets',postSnippet);

exports.snippetRouter = snippetRouter;