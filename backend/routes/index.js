const express = require('express');
const router = express.Router();

const locationsRoutes = require('./locationsRouter');
const authRoutes = require('./authRouter');
const postsRoutes = require('./postsRouter');
const aiRoutes = require('./aiRouter');
const profileRoutes = require('./profileRouter');
const chatRoutes = require('./chatRouter');

router.use('/', locationsRoutes);
router.use('/auth', authRoutes);
router.use('/posts', postsRoutes);
router.use('/ai', aiRoutes);
router.use('/users', profileRoutes);
router.use('/chat', chatRoutes);

module.exports = router;
