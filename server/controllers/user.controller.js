import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";


// Sign Up function

export const signUp = async (req, res) => {
  
  try {
    const { fullname, email, password, bio } =req.body;
    if (!fullname || !email || !password || !bio) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      bio,
    });
    const token = generateToken(newUser._id);
     res.cookie('token', token);
    res.status(201).json({
      userData: newUser,
      token,
      message: "User created successfully",
    });
  } catch (error) {
    console.log("Error in signUp:", error.message);

    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


// Sign In function

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userData = await User.findOne({ email});
        if (!userData) {
            return res.status(400).json({ message: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, userData.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }
        

        const token = generateToken(userData._id);
        res.cookie('token', token);

        res.status(200).json({
            userData:userData,
            token,
            message: "Login successful",
        });

    } catch (error) {
        console.log("Error in login:", error.message);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}

// Controller to check if user is authenticated

export const checkAuth = async (req, res) => {
    res.json({
        user: req.user,
        message: "User is authenticated",
    });
}

// Controller to update user profile

export const updateProfile = async (req, res) => {
    try {
        const { fullname, profilePic, bio } = req.body;
        console.log(req.body);
        
        const userId = req.user._id;
        let updatedUser;
        if (!profilePic){
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { fullname, bio },
                { new: true}
            );
        }
        else{
            const uploadImage = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { fullname, profilePic: uploadImage.secure_url, bio },
                { new: true }
            );
        }
        res.status(200).json({
            user: updatedUser,
            message: "Profile updated successfully",
        });
    } catch (error) {
        console.log("Error in updateProfile:", error.message);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}