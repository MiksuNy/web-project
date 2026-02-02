const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.use(auth);

// POST /requests
router.post('/', auth, (req, res) => {
  const { title, description } = req.body;

  res.status(201).json({
    message: 'Request created (mock)',
    request: { title, description }
  });
});

// GET /requests
router.get('/', (req, res) => {
  res.json([
    {
      id: '1',
      title: 'Need help with groceries',
      description: 'Once per week'
    }
  ]);
});

module.exports = router;