const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/storage');
const validatePost = require('../middleware/validatePost');

const { createPost, getPosts, getUserPosts } = require('../controllers/postController');

// GET /posts (all)
router.get('/', getPosts);

router.use(auth);

// POST /posts
router.post('/', upload.single('image'), validatePost, createPost);

// GET /posts/my (current user only)
router.get('/userposts', getUserPosts);

module.exports = router;
