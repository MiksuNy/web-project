const express = require('express');
const router = express.Router();

const { generateText } = require('../controllers/aiController');

router.post('/ask', generateText);

module.exports = router;
