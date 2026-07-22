const express = require('express');
const snippetRouter = express.Router();
const { getSnippet } = require('../controllers/snippet');
const { postSnippet } = require('../controllers/snippet'); 
const { searchSnippet } = require('../controllers/snippet');
const { searchById } = require('../controllers/snippet');
const { updateSnippet } = require('../controllers/snippet');
const { deleteSnippet } = require('../controllers/snippet');

snippetRouter.get('/snippets',getSnippet);
snippetRouter.post('/snippets',postSnippet);
snippetRouter.get('/snippets/search', searchSnippet);
snippetRouter.get('/snippets/:id', searchById);
snippetRouter.patch('/snippets/:id', updateSnippet);
snippetRouter.delete('/snippets/:id', deleteSnippet);

exports.snippetRouter = snippetRouter;