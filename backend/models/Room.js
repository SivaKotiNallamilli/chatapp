const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const Room = sequelize.define("Room", {

  roomName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  createdBy: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  noOfMembers: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

});

module.exports = Room;