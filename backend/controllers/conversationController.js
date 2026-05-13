const Conversation = require("../models/Conversation");

// CREATE OR GET CONVERSATION
const createConversation = async (req, res) => {
  try {
    const { user1Id, user2Id } = req.body;

    // CHECK EXISTING
    let conversation = await Conversation.findOne({
      where: {
        user1Id,
        user2Id,
      },
    });

    // CREATE NEW
    if (!conversation) {
      conversation = await Conversation.create({
        user1Id,
        user2Id,
      });
    }

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  createConversation,
};
