const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const Message = sequelize.define("Message", {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  senderName: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  senderEmail: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  // PUBLIC ROOM
  roomId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  // PRIVATE CHAT
  conversationId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = Message;
