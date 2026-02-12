const express = require('express');
const router = express.Router();

const { generateText } = require('../controllers/aiController.js');

router.post('/ask', generateText);

module.exports = router;
