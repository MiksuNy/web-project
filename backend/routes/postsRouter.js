const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createPost, getPosts, getUserPosts } = require('../controllers/postControllers');

// GET /posts (all)
router.get('/', getPosts);

router.use(auth);

// POST /posts
router.post('/', createPost);

// GET /posts/my (current user only)
router.get('/userposts', getUserPosts);

module.exports = router;
