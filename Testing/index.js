import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Replace with your server URL

socket.on("connect", () => {
    console.log("Connected! Socket ID:", socket.id);
});

socket.on("disconnect", (reason) => {
    console.log("Disconnected:", reason);
});

socket.on( 'content', ( data ) => {
    console.log(data);
})
