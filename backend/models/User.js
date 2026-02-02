const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['client', 'admin'],
      default: 'client'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
