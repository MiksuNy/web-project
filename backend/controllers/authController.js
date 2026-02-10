const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const {
  isValidEmail,
  isValidPassword,
  isAtLeast13YearsOld,
  isValidLocation,
  isValidPhoneNumber
} = require('../utils/validators');

// =======================
// REGISTER
// =======================
const registerUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, dateOfBirth, location, phone } = req.body;

    // ====== VALIDATION ======

    if (!firstName || !lastName || !dateOfBirth || !email || !password || !location || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format. Email must contain @ symbol' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    if (!isAtLeast13YearsOld(dateOfBirth)) {
      return res.status(400).json({ message: 'You must be at least 13 years old to register' });
    }

    if (!isValidLocation(location)) {
      return res.status(400).json({ message: 'Invalid location' });
    }

    if (!isValidPhoneNumber(phone)) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }

    // ====== CREATE USER ======

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save to DB
    const user = await User.create({
      firstName,
      lastName,
      dateOfBirth: new Date(dateOfBirth),
      email,
      password: hashedPassword,
      role: 'client',
      location,
      phone
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        email: user.email,
        role: user.role,
        location: user.location,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// =======================
// LOGIN
// =======================
const loginUser = async (req, res) => {
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
      { 
        id: user._id, 
        email: user.email, 
        role: user.role, 
        firstName: user.firstName, 
        lastName: user.lastName, 
        dateOfBirth: user.dateOfBirth,
        location: user.location,
        phone: user.phone
      },
      process.env.JWT_SECRET,
      { expiresIn: '365d' }
    );

    res.json({
      message: 'Login successful',
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// =======================
// EDIT USER INFO
// =======================
const editUser = async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, location, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, dateOfBirth, location, phone },
      { new: true }
    );

    res.json({
      message: 'User information updated',
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        dateOfBirth: updatedUser.dateOfBirth,
        email: updatedUser.email,
        role: updatedUser.role,
        location: updatedUser.location,
        phone: updatedUser.phone
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user information', error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to change password', error: error.message });
  }
};

// =======================
// DELETE USER
// =======================
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: 'User account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user account', error: error.message });
  }
};

// =======================
// GET USER INFO
// =======================
const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User information",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        email: user.email,
        role: user.role,
        location: user.location,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get user information", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  editUser,
  changePassword,
  deleteUser,
  getUserInfo
};