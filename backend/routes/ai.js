const { explainCode } = require("../controllers/ai");
const { auth } = require("../middleware/auth");
const express = require('express');
const aiRouter = express.Router();

aiRouter.post("/explain", auth, explainCode);

exports.aiRouter = aiRouter;