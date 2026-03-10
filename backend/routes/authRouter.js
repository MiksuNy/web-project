const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  registerUser,
  loginUser,
  getUserInfo,
  editUser,
  editUserById,
  changePassword,
  deleteUser,
  deleteUserById,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.use(auth);

router.get("/userinfo", getUserInfo);
router.put("/edit", editUser);
router.put("/edit/:userId", editUserById);
router.put("/change-password", changePassword);
router.delete("/delete", deleteUser);
router.delete("/delete/:userId", deleteUserById);

module.exports = router;
