import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import fs from "fs";
import path from "path";
export const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: `User Registered successfully: ${username}` });
    } catch (err) {
        res.status(500).json({ message: `Something went wrong` });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: `User not found` });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: `Invalid credential` });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const role = user.role;
        res.status(200).json({ token, role });
    } catch (err) {
        res.status(500).json({ message: `Something went wrong` });
    }
};
export const getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
    
        // Count total users
        const totalUsers = await User.countDocuments();
    
        // Fetch paginated users
        const users = await User.find()
          .sort({ createdAt: -1 })
          .skip((pageNumber - 1) * limitNumber)
          .limit(limitNumber);
    
        res.status(200).json({
          users,
          totalPages: Math.ceil(totalUsers / limitNumber),
          currentPage: pageNumber,
        });
      } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ message: "Internal server error" });
      }
};
export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findById(req.params.id);
    
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    
        user.role = role;
        await user.save();
    
        res.status(200).json({ message: "User role updated successfully", user });
      } catch (err) {
        console.error("Error updating user role:", err);
        res.status(500).json({ message: "Internal server error" });
      }
};
export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted successfully" });
      } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ message: "Internal server error" });
      }
};
export const getUserProfile = async (req, res) => {
  try {
      const userId = req.user.id;
      const user = await User.findById(userId);

      if (!user) return res.status(404).json({ message: "User not found" });

      res.status(200).json(user);
  } catch (err) {
      console.error("Error fetching user profile:", err);
      res.status(500).json({ message: "Internal server error" });
  }
};
export const updateProfileImage = async (req, res) => {
  try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      // Check if a file is uploaded
      if (!req.file) {
          return res.status(400).json({ message: "No image uploaded" });
      }

      // Delete old profile image if exists
      if (user.profileImage) {
          const oldImagePath = path.join(__dirname, "..", user.profileImage);
          if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath); // Remove old file
          }
      }

      // Save new profile image path in DB (relative path)
      user.profileImage = `/uploads/${req.file.filename}`;
      await user.save();

      res.status(200).json({ message: "Profile picture updated", profileImage: user.profileImage });
  } catch (error) {
      console.error("Error updating profile image:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};
