const express = require('express');
const snippetRouter = express.Router();
const { getSnippet } = require('../controllers/snippet');
const { postSnippet } = require('../controllers/snippet'); 
const { searchSnippet } = require('../controllers/snippet');
const { searchById } = require('../controllers/snippet');
const { updateSnippet } = require('../controllers/snippet');
const { deleteSnippet } = require('../controllers/snippet');
const { getUniqueTags } = require('../controllers/snippet');
const { auth } = require('../middleware/auth');
const { optionalAuth } = require('../middleware/optionalAuth');

snippetRouter.get('/snippets', auth, getSnippet);
snippetRouter.post('/snippets', auth, postSnippet);
snippetRouter.get('/snippets/search', auth, searchSnippet);
snippetRouter.get('/snippets/:id', optionalAuth, searchById);
snippetRouter.patch('/snippets/:id', auth, updateSnippet);
snippetRouter.delete('/snippets/:id', auth, deleteSnippet);
snippetRouter.get('/tags', auth, getUniqueTags);

exports.snippetRouter = snippetRouter;