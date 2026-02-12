const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
    {
        avatar: {
            type: String,
            required: false,
            trim: true
        },
        description: {
            type: String,
            required: false,
            trim: true
        },
        socialLinks: {
            type: [String],
            required: false
        },
        isPublic: {
            type: Boolean,
            required: true,
            default: true
        }
    }
);

module.exports = mongoose.model('Profile', profileSchema);