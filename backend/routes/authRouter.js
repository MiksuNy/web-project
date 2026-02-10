const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  registerUser,
  loginUser,
  getUserInfo,
  editUser,
  changePassword,
  deleteUser,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.use(auth);

router.get("/userinfo", getUserInfo);
router.put("/edit", editUser);
router.put("/change-password", changePassword);
router.delete("/delete", deleteUser);

module.exports = router;
