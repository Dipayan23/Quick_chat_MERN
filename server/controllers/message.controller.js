import User from "../models/user.models.js";
import Message from "../models/message.models.js";
import cloudinary from "../lib/cloudinary.js";
import { userSocketMap } from "../server.js"; // Import the userSocketMap from server.js

// Get all users except the logged-in user
export const getAllUsers = async (req, res) => {
  try {
    const UserId = req.user._id;
    const fillteredUsers = await User.find({ _id: { $ne: UserId } }).select(
      "-password"
    );

    // Count the number of messages that are unseen
    const unseenMessages = {};
    const promises = fillteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderID: user._id,
        receiverID: UserId,
        seen: false,
      });
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });

    await Promise.all(promises);
    res.status(200).json({ users: fillteredUsers, unseenMessages });
  } catch (error) {
    console.log(error.Message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Get all messages for a specific user

export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderID: myUserId, receiverID: selectedUserId },
        { senderID: selectedUserId, receiverID: myUserId },
      ],
    }).sort({ createdAt: 1 });

    // Mark messages as seen if they are from the selected user
    await Message.updateMany(
      { senderID: selectedUserId, receiverID: myUserId, seen: false },
      { $set: { seen: true } }
    );

    res.status(200).json(messages);
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// api to mark messages as seen
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id: selectedMessageId } = req.params;
    const myUserId = req.user._id;
    await Message.findByIdAndUpdate(selectedMessageId, { seen: true });
    res.status(200).json({ message: "Message marked as seen" });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// API to send a message

export const sendMessage = async (req, res) => {
  try {
    const { image, text } = req.body;
    const myUserId = req.user._id;
    const { id: selectedUserId } = req.params;

    if (!text && !image) {
      return res
        .status(400)
        .json({ message: "Message text or image is required" });
    }

    let imageUrl = null;
    if (image) {
      const uploadedImage = await cloudinary.uploader.upload(image);
      imageUrl = uploadedImage.secure_url;
    }

    const newMessage = await Message.create({
      senderID: myUserId,
      receiverID: selectedUserId,
      text: text || "",
      image: imageUrl || "",
      seen: false,
    });
    // Emit the new message to the receiver's socket if they are online
    const receiverSocketId = userSocketMap[selectedUserId];
    if (receiverSocketId) {
      req.io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
