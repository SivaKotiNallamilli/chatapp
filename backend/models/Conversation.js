const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const Conversation = sequelize.define(
  "Conversation",
  {

    user1Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    user2Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

  }
);

module.exports = Conversation;