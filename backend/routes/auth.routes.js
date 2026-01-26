const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');


// POST /auth/register
router.post('/register', (req, res) => {
  const { email, role } = req.body;

  res.status(201).json({
    message: 'User registered (mock)',
    user: { email, role }
  });
});

// POST /auth/login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const token = jwt.sign({ email, role: 'client' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({
    message: 'Login successful (mock)',
    token
  });
});

// GET /auth/me  (or /me later)
router.get('/me', auth, (req, res) => {
  res.json({
    message: 'Protected user info (mock)',
    user: req.user
  });
});

module.exports = router;