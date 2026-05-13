import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import socket from "../sockets/socket";

function PrivateChat() {
  const navigate = useNavigate();

  const { conversationId } = useParams();

  const user = JSON.parse(localStorage.getItem("user"));

  const [messages, setMessages] = useState([]);

  const [message, setMessage] = useState("");

  const [typingUser, setTypingUser] = useState("");

  const [users, setUsers] = useState([]);

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      const response = await API.get("/auth/users");

      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // FETCH PRIVATE MESSAGES
  const fetchMessages = async () => {
    try {
      const response = await API.get(`/messages/private/${conversationId}`);
      console.log(response, "sdklvmdskm");
      setMessages(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    socket.off("receive_private_message");

    socket.off("private_user_typing");

    socket.off("user_status_change");

    // USER ONLINE
    socket.emit("user_online", user.id);

    // JOIN PRIVATE ROOM
    socket.emit("join_private_room", conversationId);

    // FETCH DATA
    fetchMessages();

    fetchUsers();

    // RECEIVE PRIVATE MESSAGE
    socket.on("receive_private_message", (newMessage) => {
      console.log("NEW PRIVATE MESSAGE:", newMessage);

      setMessages((prev) => [...prev, newMessage]);
    });

    // PRIVATE TYPING
    socket.on("private_user_typing", (data) => {
      setTypingUser(`${data.username} is typing...`);

      setTimeout(() => {
        setTypingUser("");
      }, 2000);
    });

    // USER STATUS
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
      socket.off("receive_private_message");

      socket.off("private_user_typing");

      socket.off("user_status_change");
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, user.id]);

  // SEND PRIVATE MESSAGE
  const sendMessage = () => {
    if (!message.trim()) return;

    const messageData = {
      content: message,

      senderId: user.id,

      senderName: localStorage.getItem("username"),

      senderEmail: localStorage.getItem("email"),

      conversationId,
    };

    socket.emit("send_private_message", messageData);

    setMessage("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #0f172a, #1e293b)",
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
          overflow: "hidden",
          display: "flex",
          boxShadow: "0px 5px 25px rgba(0,0,0,0.3)",
        }}
      >
        {/* SIDEBAR */}

        <div
          style={{
            width: "300px",
            background: "#111827",
            color: "white",
            padding: "20px",
            overflowY: "auto",
          }}
        >
          <h2
            style={{
              marginBottom: "20px",
              borderBottom: "1px solid #374151",
              paddingBottom: "10px",
            }}
          >
            Private Users
          </h2>

          {users.map((u) => (
            <div
              key={u.id}
              style={{
                background: "#1f2937",
                padding: "12px",
                borderRadius: "12px",
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
                    fontSize: "16px",
                  }}
                >
                  {u.username}
                </div>

                <div
                  style={{
                    marginTop: "5px",
                    fontSize: "13px",
                    color: u.status === "online" ? "#4ade80" : "#9ca3af",
                  }}
                >
                  {u.status === "online" ? "🟢 Online" : "⚫ Offline"}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CHAT SECTION */}

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: "#f3f4f6",
          }}
        >
          <div
            style={{
              background: "#2563eb",
              color: "white",
              padding: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
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
              Private Chat
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
                    msg.senderId === user.id ? "flex-end" : "flex-start",
                  marginBottom: "15px",
                }}
              >
                <div
                  style={{
                    background: msg.senderId === user.id ? "#2563eb" : "white",
                    color: msg.senderId === user.id ? "white" : "black",
                    padding: "12px 16px",
                    borderRadius: "15px",
                    maxWidth: "60%",
                    boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                  }}
                >
                  <strong>
                    {msg.senderId === user.id ? "You" : `${msg.senderName}`}
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
              gap: "10px",
              padding: "20px",
              background: "white",
              borderTop: "1px solid #ddd",
            }}
          >
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);

                socket.emit("private_typing", {
                  conversationId,
                  username: user.username,
                });
              }}
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                outline: "none",
                fontSize: "15px",
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
                fontSize: "15px",
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

export default PrivateChat;
