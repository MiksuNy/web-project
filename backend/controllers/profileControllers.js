const User = require('../models/userModel');

// GET /users/:userId
const getUserProfile = async (req, res) => {
    try {
        const id = req.params.userId;

        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        if (!user.isPublic) {
            return res.status(403).json({ message: 'User profile is not public' });
        }

        res.status(200).json({
            userProfile: {
                id: user._id,
                avatar: user.avatar,
                description: user.description,
                socialLinks: user.socialLinks
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Getting profile data failed', error: error.message });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Getting all users failed', error: error.message });
    }
}

// PUT /users
const editUserProfile = async (req, res) => {
    try {
        const { avatar, description, socialLinks, isPublic } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { avatar, description, socialLinks, isPublic },
            { new: true }
        );

        res.json({
            message: 'User profile information updated',
            userProfile: {
                id: updatedUser._id,
                avatar: updatedUser.avatar,
                description: updatedUser.description,
                socialLinks: updatedUser.socialLinks,
                isPublic: updatedUser.isPublic
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user profile information', error: error.message });
    }
}

module.exports = {
    getUserProfile,
    editUserProfile,
    getAllUsers
};