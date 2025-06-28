import express from 'express';
import { signUp,login,checkAuth,updateProfile } from '../controllers/user.controller.js';
import {protectRoute} from '../middleware/auth.middleware.js';

const userRouter = express.Router();
// Route to handle user registration
userRouter.post('/signup', signUp);
// Route to handle user login
userRouter.post('/login', login);
// Route to check if user is authenticated
userRouter.get('/check-auth', protectRoute, checkAuth);
// Route to update user profile
userRouter.put('/update-profile', protectRoute, updateProfile);

export default userRouter;