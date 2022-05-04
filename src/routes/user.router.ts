import { Router } from 'express';
const userRouter = Router();

// Controllers
import UserController from '../controllers/User.controller';

//
import { authChecker } from '../middlewares/authChecker'

userRouter.get('/user', authChecker, UserController.getUserInfo);
userRouter.delete('/user', authChecker, UserController.deleteUser);

export { userRouter }