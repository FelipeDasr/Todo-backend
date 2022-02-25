import { Router } from 'express';
const router = Router();

// Routers
import { authenticationRouter } from './authentication.router';
import { taskRouter } from './task.router';
import { userRouter } from './user.router';

//
import { authChecker } from '../middlewares/authChecker'

// authentication routes
router.use(authenticationRouter);

// Routes with authentication checker
router.use(authChecker, userRouter);
router.use(authChecker, taskRouter);

export { router }