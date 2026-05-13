const Message = require("../models/Message");


// GET ROOM MESSAGES
const getMessages = async (req, res) => {

  try {

    const { roomId } = req.params;

    const messages = await Message.findAll({
      where: { roomId },
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json(messages);

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error,
    });

  }

};

// GET PRIVATE MESSAGES
const getPrivateMessages =
  async (req, res) => {

    try {

      const { conversationId } =
        req.params;

      const messages =
        await Message.findAll({

          where: {
            conversationId:
            parseInt(conversationId),
          },

          order: [
            ["createdAt", "ASC"]
          ],

        });

      res.status(200).json(
        messages
      );

    } catch (error) {

      res.status(500).json({
        message: "Server Error",
      });

    }

};

module.exports = {
  getMessages,
  getPrivateMessages,
};