import { Router } from 'express';
const router = Router();

// Routers
import { authenticationRouter } from './authentication.router';
import { taskRouter } from './task.router';
import { userRouter } from './user.router';

// authentication routes
router.use(authenticationRouter);

// Routes with authentication checker
router.use(userRouter);
router.use(taskRouter);

export { router }