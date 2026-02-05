const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {registerUser, loginUser, getUserInfo} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);

router.use(auth);

router.get('/userinfo', getUserInfo);

module.exports = router;
