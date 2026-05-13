const Room = require("../models/Room");


// CREATE ROOM
const createRoom = async (req, res) => {

  try {

    const { roomName, email } = req.body;

    // Validate
    if (!roomName) {
      return res.status(400).json({
        message: "Room name required",
      });
    }

    // Check existing room
    const existingRoom = await Room.findOne({
      where: { roomName },
    });

    if (existingRoom) {
      return res.status(400).json({
        message: "Room already exists",
      });
    }

    // Create room
    const room = await Room.create({
      roomName,
      createdBy: email,
      noOfMembers: 0,
    });

    res.status(201).json({
      message: "Room created successfully",
      room,
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error,
    });

  }

};



// GET ALL ROOMS
const getRooms = async (req, res) => {

  try {

    const rooms = await Room.findAll({
      order: [["createdAt", "DESC"]],
    });
    console.log("getroomsresp", rooms)
    res.status(200).json(rooms);

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error,
    });

  }

};

module.exports = {
  createRoom,
  getRooms,
};