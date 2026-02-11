const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/storage");
const validatePost = require("../middleware/validatePost");

const {
  createPost,
  getPosts,
  getUserPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/postController");

// GET /posts (all)
router.get("/", getPosts);
// GET /posts/user/:userId (posts by user ID)
router.get('/user/:userId', getUserPosts);
// GET /posts/:postId (single post by ID)
router.get('/:postId', getPostById);

router.use(auth);

// POST /posts
router.post("/", upload.single("image"), validatePost, createPost);
router.put("/:postId", upload.single("image"), validatePost, updatePost);
router.delete("/:postId", deletePost);

module.exports = router;
