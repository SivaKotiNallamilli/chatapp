import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import API from "../services/api";

import socket from "../sockets/socket";

import { useNavigate } from "react-router-dom";

function ChatRoom() {
  const { roomId,roomName } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [typingUser, setTypingUser] = useState("");

  // FETCH OLD MESSAGES
  const fetchMessages = async () => {
    try {
      const response = await API.get(`/messages/${roomId}`);
      setMessages(response.data);
      console.log(response.data,"hjvxsgx")
    } catch (error) {
      console.log(error);
    }
  };

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      const response = await API.get("/auth/users");

      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // SOCKET + ROOM
  useEffect(() => {
    // JOIN ROOM
    socket.emit("join_room", roomId);

    socket.off("receive_message");

    socket.off("user_typing");

    socket.off("user_status_change");

    // USER ONLINE
    socket.emit("user_online", user.id);

    // FETCH DATA
    fetchMessages();

    fetchUsers();

    // RECEIVE MESSAGE
    socket.on("receive_message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    // USER TYPING
    socket.on("user_typing", (data) => {
      setTypingUser(`${data.username} is typing...`);

      // REMOVE AFTER 2 SECONDS
      setTimeout(() => {
        setTypingUser("");
      }, 2000);
    });

    // USER STATUS CHANGE
    socket.on("user_status_change", (data) => {
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === data.userId
            ? {
                ...u,
                status: data.status,
              }
            : u,
        ),
      );
    });

    // CLEANUP
    return () => {
      socket.off("receive_message");

      socket.off("user_status_change");

      socket.off("user_typing");
    };
  }, [roomId]);

  // SEND MESSAGE
  const sendMessage = () => {
    if (!message.trim()) return;

    const messageData = {
      content: message,
      senderId: user.id,
      roomId,
      senderName: localStorage.getItem("username"),
      senderEmail: localStorage.getItem("email"),
    };

    socket.emit("send_message", messageData);

    setMessage("");
  };

  // START PRIVATE CHAT
  const startPrivateChat = async (otherUserId) => {
    try {
      const response = await API.post("/conversations/create", {
        user1Id: user.id,
        user2Id: otherUserId,
      });

      const conversation = response.data;

      navigate(`/private/${conversation.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
  <div
    style={{
      minHeight: "100vh",
      background: "linear-gradient(to right, #141e30, #243b55)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      fontFamily: "Arial",
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: "1200px",
        height: "90vh",
        background: "white",
        borderRadius: "20px",
        display: "flex",
        overflow: "hidden",
        boxShadow: "0px 5px 25px rgba(0,0,0,0.3)",
      }}
    >
      {/* USERS SIDEBAR */}

      <div
        style={{
          width: "300px",
          background: "#1f2937",
          color: "white",
          padding: "20px",
          overflowY: "auto",
        }}
      >
        <h2
          style={{
            marginBottom: "20px",
            borderBottom: "1px solid gray",
            paddingBottom: "10px",
          }}
        >
          Users
        </h2>

        {users.map((u) => (
          <div
            key={u.id}
            style={{
              background: "#374151",
              padding: "12px",
              borderRadius: "10px",
              marginBottom: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: "bold",
                }}
              >
                {u.username}
              </div>

              <div
                style={{
                  fontSize: "13px",
                  marginTop: "4px",
                  color:
                    u.status === "online"
                      ? "#4ade80"
                      : "#9ca3af",
                }}
              >
                {u.status === "online"
                  ? "🟢 Online"
                  : "⚫ Offline"}
              </div>
            </div>

            {u.id !== user.id && (
              <button
                onClick={() =>
                  startPrivateChat(u.id)
                }
                style={{
                  background: "#3b82f6",
                  border: "none",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Message
              </button>
            )}
          </div>
        ))}
      </div>

      {/* CHAT SECTION */}

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER */}

        <div
  style={{
    background: "#2563eb",
    color: "white",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow:
      "0px 2px 5px rgba(0,0,0,0.1)",
  }}
>

  <button
    onClick={() => navigate(-1)}
    style={{
      background: "white",
      color: "#2563eb",
      border: "none",
      padding: "10px 18px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "14px",
    }}
  >
    ← Back
  </button>

  <h2
    style={{
      margin: 0,
      fontSize: "22px",
    }}
  >
    {roomName}
  </h2>

  <div></div>

</div>

        {/* MESSAGE AREA */}

        <div
          style={{
            flex: 1,
            padding: "20px",
            overflowY: "auto",
            background: "#f3f4f6",
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  msg.senderId === user.id
                    ? "flex-end"
                    : "flex-start",
                marginBottom: "15px",
              }}
            >
              <div
                style={{
                  background:
                    msg.senderId === user.id
                      ? "#2563eb"
                      : "white",
                  color:
                    msg.senderId === user.id
                      ? "white"
                      : "black",
                  padding: "12px 16px",
                  borderRadius: "15px",
                  maxWidth: "60%",
                  boxShadow:
                    "0px 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                <strong>
                  {msg.senderId === user.id
                    ? "You"
                    : `${msg.senderName}`}
                </strong>

                <p
                  style={{
                    marginTop: "5px",
                    marginBottom: "0",
                  }}
                >
                  {msg.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* TYPING */}

        <div
          style={{
            height: "25px",
            paddingLeft: "20px",
            color: "gray",
            fontStyle: "italic",
          }}
        >
          {typingUser}
        </div>

        {/* INPUT AREA */}

        <div
          style={{
            display: "flex",
            padding: "20px",
            gap: "10px",
            borderTop: "1px solid #ddd",
            background: "white",
          }}
        >
          <input
            type="text"
            placeholder="Enter Message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);

              socket.emit("typing", {
                roomId,
                username: user.username,
              });
            }}
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              outline: "none",
              fontSize: "16px",
            }}
          />

          <button
            onClick={sendMessage}
            style={{
              padding: "14px 25px",
              border: "none",
              borderRadius: "10px",
              background: "#2563eb",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
);
}

export default ChatRoom;
