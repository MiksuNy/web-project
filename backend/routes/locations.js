const express = require('express');
const router = express.Router();
const municipalities = require('../data/municipalities.json');

router.get('/', (req, res) => {
  res.json({ cities: municipalities });
});

module.exports = router;
    