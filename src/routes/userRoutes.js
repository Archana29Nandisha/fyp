import express from 'express';
import verifyToken from '../middlewares/authMiddleware.js';
import authorizeRole from '../middlewares/roleMiddleware.js';
import { upload } from "../middlewares/multerMiddleware.js";


import {
    getProjects,
    addProject,
    approveProject,
    addReview,
    deleteProject,
    getProjectByID,
    getUser,
    getAllProjects,
    getfullProjects
} from '../controllers/projectController.js';
import { getUsers,deleteUser,updateUserRole ,getUserProfile,updateProfileImage} from '../controllers/authController.js';
const routes = express.Router();

// Only Admin can use these Routes
routes.put('/projects/:id/approve', verifyToken, authorizeRole('admin'), approveProject);
routes.delete('/projects/:id', verifyToken, authorizeRole('admin'), deleteProject);
routes.delete('/users/:id', verifyToken, authorizeRole('admin'), deleteUser);
routes.get('/users', verifyToken, authorizeRole('admin'), getUsers);
routes.put('/users/:id/role', verifyToken, authorizeRole('admin'), updateUserRole);
routes.get('/profile', verifyToken, authorizeRole('admin', 'developer', 'user'), getUserProfile);


// Both Admin and Developer can access these Routes
routes.post('/projects', upload.single("image"), verifyToken, authorizeRole('admin', 'developer'), addProject);

// All users can access these Routes
routes.get('/projects', verifyToken, authorizeRole('admin', 'developer', 'user'), getProjects);
routes.get('/allprojects/', verifyToken, authorizeRole('admin'), getAllProjects);
routes.get('/fullprojects/', verifyToken, authorizeRole('admin'), getfullProjects);
routes.get('/:userID', verifyToken, authorizeRole('admin', 'developer', 'user'), getUser);
routes.post('/reviews', verifyToken, authorizeRole('admin', 'developer', 'user'), addReview);
routes.get('/projects/:projectId', verifyToken, authorizeRole('admin', 'developer', 'user'), getProjectByID);
routes.put("/:id/profile-image", upload.single("profileImage"), updateProfileImage);

// Export as ES Module
export default routes;
