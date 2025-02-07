import express from 'express';
import verifyToken from '../middlewares/authMiddleware.js';
import authorizeRole from '../middlewares/roleMiddleware.js';
import {
    getProjects,
    addProject,
    approveProject,
    addReview,
    deleteProject
} from '../controllers/projectController.js';

const routes = express.Router();

// Only Admin can use these Routes
routes.put('/projects/:id/approve', verifyToken, authorizeRole('admin'), approveProject);
routes.delete('/projects/:id', verifyToken, authorizeRole('admin'), deleteProject);

// Both Admin and Developer can access these Routes
routes.post('/projects', verifyToken, authorizeRole('admin', 'developer'), addProject);

// All users can access these Routes
routes.get('/projects', verifyToken, authorizeRole('admin', 'developer', 'user'), getProjects);
routes.post('/reviews', verifyToken, authorizeRole('admin', 'developer', 'user'), addReview);

// Export as ES Module
export default routes;
