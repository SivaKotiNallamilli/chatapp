const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const {
  register,
  login,
  getUsers,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get(
  "/users",
  authMiddleware,
  getUsers
);

module.exports = router;