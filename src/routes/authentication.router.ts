import { Router } from 'express';
const authenticationRouter = Router();

import AuthController from '../controllers/Auth.controller';

// Limiters

import { ChangePasswordLimiter } from './limiters/ChangePasswordLimiter';
import { ForgotPasswordLimiter} from './limiters/ForgotPasswordLimiter';

// Routes

authenticationRouter.post('/signup', AuthController.signup);
authenticationRouter.post('/signin', AuthController.signin);

authenticationRouter.post('/forgot-password', ForgotPasswordLimiter, AuthController.forgotPassword);
authenticationRouter.post('/change-password', ChangePasswordLimiter, AuthController.changePassword);

export { authenticationRouter }