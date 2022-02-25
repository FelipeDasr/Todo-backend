import { Router } from 'express';
const authenticationRouter = Router();

import AuthController from '../controllers/Auth.controller';

authenticationRouter.post('/signup', AuthController.signup);
authenticationRouter.post('/signin', AuthController.signin);

authenticationRouter.post('/forgot-password', AuthController.forgotPassword);
authenticationRouter.post('/change-password', AuthController.changePassword);

export { authenticationRouter }