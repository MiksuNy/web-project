const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createRequest, getRequests } = require('../controllers/requestControllers');

router.use(auth);

// POST /requests
router.post('/', createRequest);

// GET /requests
router.get('/', getRequests);

module.exports = router;