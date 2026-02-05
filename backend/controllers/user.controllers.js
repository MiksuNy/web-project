const User = require('../models/User');

// GET /users/:userId
const getUserById = (req, res) => {
    const userId = req.params.userId;
    const user = User.findById(userId);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: "User not found" });
    }
}

// PUT /users/:userId
const updateUserById = (req, res) => {
    const userId = req.params.userId;
    const updatedUser = User.findByIdAndUpdate(userId, { ...req.body });
    if (updatedUser) {
        res.json(updatedUser);
    } else {
        res.status(400).json({ message: "User not found" });
    }
}

module.exports = {
    getUserById,
    updateUserById
}