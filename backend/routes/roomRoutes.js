const express = require("express");

const router = express.Router();

const {
  createRoom,
  getRooms,
} = require("../controllers/roomController");

const authMiddleware = require("../middleware/authMiddleware");


// CREATE ROOM
router.post(
  "/create",
  authMiddleware,
  createRoom
);


// GET ROOMS
router.get(
  "/all",
  authMiddleware,
  getRooms
);

module.exports = router;