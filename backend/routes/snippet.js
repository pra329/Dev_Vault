const express = require('express');
const snippetRouter = express.Router();
const { getSnippet } = require('../controllers/snippet');
const { postSnippet } = require('../controllers/snippet'); 
const { searchSnippet } = require('../controllers/snippet');

snippetRouter.get('/snippets',getSnippet);
snippetRouter.post('/snippets',postSnippet);
snippetRouter.get('/snippets/search', searchSnippet);

exports.snippetRouter = snippetRouter;