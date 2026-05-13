const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

// DATABASE
const sequelize = require("./config/database");

// MODELS
const User = require("./models/User");
const Room = require("./models/Room");
const Message = require("./models/Message");
const Conversation = require("./models/Conversation");

// ROUTES
const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const messageRoutes = require("./routes/messageRoutes");
const conversationRoutes = require(
  "./routes/conversationRoutes"
);

// MIDDLEWARE
const authMiddleware = require("./middleware/authMiddleware");

// EXPRESS APP
const app = express();

// HTTP SERVER
const server = http.createServer(app);

// SOCKET SERVER
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Chat Server Running");
});

// PROTECTED TEST ROUTE
app.get(
  "/protected",
  authMiddleware,
  (req, res) => {
    res.json({
      message: "Protected Route Accessed",
      user: req.user,
    });
  }
);

// API ROUTES
app.use("/api/auth", authRoutes);

app.use("/api/rooms", roomRoutes);

app.use("/api/messages", messageRoutes);

app.use(
  "/api/conversations",
  conversationRoutes
);

// ================= SOCKET.IO =================

io.on("connection", (socket) => {

  console.log("User Connected:", socket.id);

  // USER ONLINE
  socket.on("user_online", async (userId) => {

    try {

      socket.userId = userId;

      await User.update(
        { status: "online" },
        {
          where: { id: userId },
        }
      );

      io.emit("user_status_change", {
        userId,
        status: "online",
      });

      console.log(`User ${userId} is online`);

    } catch (error) {

      console.log(error);

    }

  });

  // JOIN PUBLIC ROOM
  socket.on(
    "join_room",
    (roomId) => {

      const room = `room_${roomId}`;

      socket.join(room);

      console.log(`Joined ${room}`);

    }
  );

  // JOIN PRIVATE ROOM
  socket.on(
    "join_private_room",
    (conversationId) => {

      const privateRoom =
        `private_${conversationId}`;

      socket.join(privateRoom);

      console.log(
        `Joined ${privateRoom}`
      );

    }
  );

  // SEND PUBLIC MESSAGE
  socket.on(
    "send_message",
    async (data) => {

      try {

        const newMessage =
          await Message.create({

            content: data.content,

            senderId: data.senderId,

            senderName: data.senderName,

            senderEmail: data.senderEmail,

            roomId: parseInt(
              data.roomId
            ),

          });

        io.to(
          `room_${data.roomId}`
        ).emit(
          "receive_message",
          newMessage
        );

      } catch (error) {

        console.log(error);

      }

    }
  );

  // SEND PRIVATE MESSAGE
  socket.on(
    "send_private_message",
    async (data) => {

      try {

        console.log(
          "PRIVATE MESSAGE DATA:",
          data
        );

        const newMessage =
          await Message.create({

            content: data.content,

            senderId: parseInt(
              data.senderId
            ),

            senderName:
              data.senderName,

            senderEmail:
              data.senderEmail,

            conversationId:
              parseInt(
                data.conversationId
              ),

          });

        console.log(
          "PRIVATE MESSAGE SAVED:",
          newMessage
        );

        io.to(
          `private_${data.conversationId}`
        ).emit(
          "receive_private_message",
          newMessage
        );

      } catch (error) {

        console.log(
          "PRIVATE MESSAGE ERROR:",
          error
        );

      }

    }
  );

  // PRIVATE TYPING
  socket.on(
    "private_typing",
    (data) => {

      socket.to(
        `private_${data.conversationId}`
      ).emit(
        "private_user_typing",
        {
          username: data.username,
        }
      );

    }
  );

  // PUBLIC TYPING
  socket.on(
    "typing",
    (data) => {

      socket.to(
        `room_${data.roomId}`
      ).emit(
        "user_typing",
        {
          username: data.username,
        }
      );

    }
  );

  // USER DISCONNECT
  socket.on("disconnect", async () => {

    console.log("User Disconnected");

    try {

      if (socket.userId) {

        await User.update(
          { status: "offline" },
          {
            where: { id: socket.userId },
          }
        );

        io.emit("user_status_change", {
          userId: socket.userId,
          status: "offline",
        });

        console.log(
          `User ${socket.userId} is offline`
        );

      }

    } catch (error) {

      console.log(error);

    }

  });

});

// PORT
const PORT = process.env.PORT || 5000;

// DATABASE + SERVER START
sequelize.sync()
  .then(() => {

    console.log("Database Connected");

    server.listen(PORT, () => {

      console.log(
        `Server running on port ${PORT}`
      );

    });

  })
  .catch((err) => {

    console.log(
      "Database Connection Error:",
      err
    );

  });