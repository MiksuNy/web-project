const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/storage');
const validatePost = require('../middleware/validatePost');

const { createPost, getPosts, getUserPosts, updatePost, deletePost } = require('../controllers/postController');

// GET /posts (all)
router.get('/', getPosts);

// GET /posts/:id (posts by user ID)
// later add to auth middleware to check if the user is requesting their own posts
router.get('/:id', getUserPosts);

router.use(auth);

// POST /posts
router.post('/', upload.single('image'), validatePost, createPost);
router.put('/:id', upload.single('image'), validatePost, updatePost);
router.delete('/:id', deletePost);

module.exports = router;
