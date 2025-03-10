import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import dbConnect from './config/dbConnect.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

dbConnect();

const app = express();
app.use(cors());
app.set('trust proxy', 1);

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendBuildPath = path.join(__dirname, '../frontend/build');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend in production mode
if (process.env.NODE_ENV === 'production') {
   app.use(express.static(frontendBuildPath));
   
   app.get('/manifest.json', (req, res) => {
      res.sendFile(path.join(frontendBuildPath, 'manifest.json'));
   });

   app.get('*', (req, res) => {
      res.sendFile(path.resolve(frontendBuildPath, 'index.html'));
   });
}

const PORT = process.env.PORT || 7002;
app.listen(PORT, () => {
   console.log(`Server is Running on Port: ${PORT}`);
});
