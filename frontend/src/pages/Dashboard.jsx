import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../services/api";

function Dashboard() {

  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);

  const [roomName, setRoomName]
    = useState("");


  // FETCH ROOMS
  const fetchRooms = async () => {

    try {

      const response =
        await API.get("/rooms/all");

      setRooms(response.data);

    } catch (error) {

      console.log(error);

    }

  };


  // CREATE ROOM
  const createRoom = async () => {

    try {

      const email =
        localStorage.getItem("email");

      await API.post(
        "/rooms/create",
        {
          roomName,
          email,
        }
      );

      setRoomName("");

      fetchRooms();

    } catch (error) {

      alert(
        error.response.data.message
      );

    }

  };


  // LOAD ROOMS
  useEffect(() => {

    fetchRooms();

  }, []);


  return (

    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to right, #141e30, #243b55)",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >

      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          background: "white",
          borderRadius: "15px",
          padding: "30px",
          boxShadow:
            "0px 5px 20px rgba(0,0,0,0.3)",
        }}
      >

        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >

          <h1
            style={{
              color: "#243b55",
              margin: 0,
            }}
          >
            Chat Dashboard
          </h1>

          <div
            style={{
              background: "#243b55",
              color: "white",
              padding: "8px 15px",
              borderRadius: "20px",
              fontSize: "14px",
            }}
          >
            {
              localStorage.getItem(
                "username"
              )
            }
          </div>

        </div>


        {/* CREATE ROOM */}

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "30px",
          }}
        >

          <input
            type="text"
            placeholder="Enter Room Name"
            value={roomName}
            onChange={(e) =>
              setRoomName(
                e.target.value
              )
            }
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "8px",
              border:
                "1px solid #ccc",
              outline: "none",
              fontSize: "16px",
            }}
          />

          <button
            onClick={createRoom}
            style={{
              padding:
                "12px 20px",
              border: "none",
              borderRadius: "8px",
              background: "#243b55",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Create Room
          </button>

        </div>


        {/* ROOM LIST */}

        <div>

          <h2
            style={{
              color: "#333",
              marginBottom: "20px",
            }}
          >
            Available Rooms
          </h2>

          {
            rooms.length === 0 ? (

              <p
                style={{
                  color: "gray",
                }}
              >
                No rooms available
              </p>

            ) : (

              rooms.map((room) => (

                <div
                  key={room.id}
                  onClick={() =>
                    navigate(
                      `/chat/${room.id}/${room.roomName}`
                    )
                  }
                  style={{
                    background:
                      "linear-gradient(to right, #4facfe, #00f2fe)",
                    color: "white",
                    padding: "20px",
                    borderRadius: "12px",
                    marginBottom: "15px",
                    cursor: "pointer",
                    transition: "0.3s",
                    boxShadow:
                      "0px 3px 10px rgba(0,0,0,0.2)",
                  }}
                >

                  <h3
                    style={{
                      margin: 0,
                    }}
                  >
                    {room.roomName}
                  </h3>

                  <p
                    style={{
                      marginTop: "8px",
                      fontSize: "14px",
                    }}
                  >
                    Created By:
                    {" "}
                    {room.createdBy}
                  </p>

                  <p
                    style={{
                      fontSize: "13px",
                    }}
                  >
                    Members:
                    {" "}
                    {room.noOfMembers}
                  </p>

                </div>

              ))

            )
          }

        </div>

      </div>

    </div>

  );

}

export default Dashboard;