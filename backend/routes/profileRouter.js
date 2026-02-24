const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getUserProfile, editUserProfile } = require('../controllers/profileControllers');

router.get('/:id', getUserProfile);

router.use(auth);

router.put('/', editUserProfile);

module.exports = router;