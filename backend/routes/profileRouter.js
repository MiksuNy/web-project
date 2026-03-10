const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getUserProfile, editUserProfile, getAllUsers } = require('../controllers/profileControllers');

router.get('/:userId', getUserProfile);
router.get('/', getAllUsers);

router.use(auth);

router.put('/', editUserProfile);

module.exports = router;