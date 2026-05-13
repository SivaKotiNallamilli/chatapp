import { io } from "socket.io-client";

//const socket = io("http://localhost:5000");/
const socket = io("https://chatapp-g1xv.onrender.com", {
  transports: ["websocket"],
  withCredentials: true
});


export default socket;