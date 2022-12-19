const socket = require("socket.io");
const  cors =require('cors')
const express =require('express');
const { json } = require("express");
const app=express();
app.use(cors());
app.use(json());
const server=app.listen(5001,()=>{
    console.log("socket server started ..at port 5001");
})
const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });
  let users = [];
  
  const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  };
  
  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };
  
  const getUser = (userId) => {
    users.find((user) => user.userId === userId);
  };
  
  io.on("connection", (socket) => {
    //when ceonnect
    // console.log("a user connected.");
  
    //take userId and socketId from user
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    });
  
    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      const user = getUser(receiverId);
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    });
  
    //when disconnect
    socket.on("disconnect", () => {
      // console.log("a user disconnected!");
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });
  