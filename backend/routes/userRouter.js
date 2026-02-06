const express = require('express');
const router = express.Router();
const { getUserById, updateUserById } = require('../controllers/userControllers');

// GET /users/:userId
router.get('/:userId', getUserById);

// PUT /users/:userId
router.put('/:userId', updateUserById);

module.exports = router;