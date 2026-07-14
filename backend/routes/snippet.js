const express = require('express');
const snippetRouter = express.Router();
const { postSnippet } = require('../controllers/snippet'); 

snippetRouter.post('/snippets',postSnippet);

exports.snippetRouter = snippetRouter;