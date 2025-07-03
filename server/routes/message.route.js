import express from 'express';
import {protectRoute} from '../middleware/auth.middleware.js';
import { getAllUsers, getMessages,markMessageAsSeen,sendMessage } from '../controllers/message.controller.js';

const messageRouter = express.Router();

// Get all users for the sidebar
messageRouter.get('/users', protectRoute, getAllUsers);
messageRouter.get('/:id', protectRoute, getMessages);
// Mark messages as seen
messageRouter.put('/seen/:id', protectRoute, markMessageAsSeen);
// send message to a user
messageRouter.post('/send/:id', protectRoute, sendMessage);

export default messageRouter;