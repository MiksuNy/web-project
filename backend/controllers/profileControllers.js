const User = require('../models/userModel');

// GET /users/profile:id
const getUserProfile = async (req, res) => {
    try {
        const id = req.params.id;

        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        if (!user.isPublic) {
            return res.status(403).json({ message: 'User profile is not public' });
        }

        res.status(200).json({
            profile: {
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

module.exports = {
    getUserProfile
};