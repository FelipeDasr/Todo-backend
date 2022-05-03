import { Router } from 'express';
const authenticationRouter = Router();

import AuthController from '../controllers/Auth.controller';

// Limiters

import { ChangePasswordLimiter } from './limiters/ChangePasswordLimiter';
import { ForgotPasswordLimiter } from './limiters/ForgotPasswordLimiter';

// Middleware

import { refreshTokenChecker } from '../middlewares//refreshTokenChecker';

// Routes

authenticationRouter.post('/signup', AuthController.signup);
authenticationRouter.post('/signin', AuthController.signin);

authenticationRouter.post('/refresh-token', refreshTokenChecker, AuthController.getNewAccessToken);

authenticationRouter.post('/forgot-password', ForgotPasswordLimiter, AuthController.forgotPassword);
authenticationRouter.post('/change-password', ChangePasswordLimiter, AuthController.changePassword);

authenticationRouter.get('/email-exists', AuthController.checkIfTheEmailExists);

authenticationRouter.get('/password-reset-code/is-correct',
    AuthController.checkIfPasswordResetCodeIsCorrect
);

export { authenticationRouter }