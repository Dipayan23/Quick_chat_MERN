import express from "express";
import cors from "cors";
import "dotenv/config";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import messageRouter from "./routes/message.route.js";
import { Server } from "socket.io";

// Creating express app and Http server
const app = express();
const server = http.createServer(app);

// Setting up Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// store online users
export const userSocketMap = {}; //{userId: socketId}

// Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
  if (userId) {
    userSocketMap[userId] = socket.id; // Store the socket ID for the user
  }
  // Emit online users to all clients
  io.emit("onlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${userId}`);
    delete userSocketMap[userId]; // Remove the socket ID for the user
    io.emit("onlineUsers", Object.keys(userSocketMap)); // Emit updated online users
  });
});
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// Importing routes
app.use("/api/status", (req, res) => {
  res.send("Server is running");
});

// Importing user routes

app.use("/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connecting to MongoDB
await connectDB();

// Starting the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
