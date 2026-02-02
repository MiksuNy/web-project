const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');

// =======================
// REGISTER (REAL)
// =======================
router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save to DB
    const user = await User.create({
      email,
      password: hashedPassword,
      role: role || 'client'
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error });
  }
});

// =======================
// LOGIN (REAL)
// =======================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
});

// =======================
// PROTECTED ROUTES
// =======================
router.use(auth);

router.get('/me', (req, res) => {
  res.json({
    message: 'Protected user info',
    user: req.user
  });
});

module.exports = router;
