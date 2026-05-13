const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { createConversation } = require("../controllers/conversationController");

// CREATE CONVERSATION
router.post("/create", authMiddleware, createConversation);

module.exports = router;
