import express from 'express';
import { register, login } from '../controllers/authController.js'; // ✅ Correct import

const routes = express.Router();

routes.post('/register', register);
routes.post('/login', login);

export default routes;
