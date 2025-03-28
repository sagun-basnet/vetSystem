import { io } from "socket.io-client";

const socket = io("http://localhost:5050", {
  autoConnect: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;
