const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/profileControllers');

router.get('/profile/:id', getUserProfile);

module.exports = router;