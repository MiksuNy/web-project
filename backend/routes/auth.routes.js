const express = require('express');
const router = express.Router();

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
  res.json({
    message: 'Login successful (mock)',
    token: 'fake-jwt-token'
  });
});

// GET /auth/me  (or /me later)
router.get('/me', (req, res) => {
  res.json({
    id: '123',
    email: 'test@test.com',
    role: 'client'
  });
});

module.exports = router;