import express from "express";
import cors from "cors";
import "dotenv/config";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";

// Creating express app and Http server
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());


// Importing routes
app.use("/api/status", (req, res) => {
    res.send("Server is running");
    }
);

// Importing user routes

app.use("/auth",userRouter);

// Connecting to MongoDB
await connectDB()

// Starting the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});