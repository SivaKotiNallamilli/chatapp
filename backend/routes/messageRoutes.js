const express = require("express");

const router = express.Router();

const {
  getMessages,
  getPrivateMessages,
} = require("../controllers/messageController");

const authMiddleware = require("../middleware/authMiddleware");

router.get(
  "/private/:conversationId",
  authMiddleware,
  getPrivateMessages
);
// GET ROOM MESSAGES
router.get(
  "/:roomId",
  authMiddleware,
  getMessages
);

module.exports = router;