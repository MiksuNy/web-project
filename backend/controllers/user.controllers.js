const User = require('../models/User');
const mongoose = require('mongoose');

// GET /users/:userId
const getUserById = async (req, res) => {
    const userId = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user id" });
    }

    try {
        const user = await User.findById(userId);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

// PUT /users/:userId
const updateUserById = async (req, res) => {
    const userId = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user id" });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { ...req.body });
        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(400).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

module.exports = {
    getUserById,
    updateUserById
}