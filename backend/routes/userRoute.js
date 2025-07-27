import express from 'express';
import { loginUser, registerUser, adminLogin } from '../controllers/userController.js';

// Initialize router
const userRouter = express.Router();

// Debugging
console.log('\x1b[36m%s\x1b[0m', `🔄 User routes initialized at ${new Date().toISOString()}`);

// Routes
userRouter.post('/register', (req, res, next) => {
  console.log('Register route hit');
  next();
}, registerUser);

userRouter.post('/login', (req, res, next) => {
  console.log('Login route hit');
  next();
}, loginUser);

userRouter.post('/admin/login', (req, res, next) => {
  console.log('Admin login route hit');
  next();
}, adminLogin);

// Error handling middleware
userRouter.use((err, req, res, next) => {
  console.error('\x1b[31m%s\x1b[0m', `User route error: ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'User operation failed'
  });
});

export default userRouter;