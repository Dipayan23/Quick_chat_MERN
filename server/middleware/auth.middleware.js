import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';

// Middleware to protect routes

export const protectRoute = async (req, res, next) => {
    
        const token =await req.headers.token || req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];
        if(!token) {
            return res.status(401).json({ message: 'Unauthorized access, token not found' });
        }
        
     try {   
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = user;
        return next();
    } catch (error) {
        return res.status(401).json({
            message: 'Unauthorized access',
            error: error.message,
        });
    }
}
