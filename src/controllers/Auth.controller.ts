import { Request, Response } from 'express';

import UserValidator from '../validators/UserValidator';

import { ValidationError } from '../classes/ValidationError';
import { ServiceError } from '../classes/ServiceError';

import JwtTokenServices from '../services/JwtTokenServices';
import UserServices from '../services/UserServices';

class AuthenticationController {

    public async signup(req: Request, res: Response): Promise<Response> {

        // Body validation
        const value = UserValidator.user(req.body);

        // Checks the validation result
        if (value instanceof ValidationError) {
            return res.status(422).json({
                errors: value.errors
            });
        }

        // Trying to create the new user
        const newUserResult = await UserServices.createNewUser(value);

        // Checks for an error when trying to create a new user
        if (newUserResult instanceof ServiceError) {
            return res.status(newUserResult.code).json({
                errors: [newUserResult.message]
            });
        }
        //
        return res.status(201).json(newUserResult);
    }

    public async signin(req: Request, res: Response): Promise<Response> {
        console.log('HERE')
        // Body validation
        const value = UserValidator.userSignin(req.body);

        // Checks the validation result
        if (value instanceof ValidationError) {
            return res.status(422).json({
                errors: value.errors
            });
        }

        const userResult = await UserServices.getUserByEmailAndPassword(
            value.email, value.password
        );

        // Checks if the email and password is correct
        if (userResult instanceof ServiceError) {
            return res.status(userResult.code).json({
                errors: [userResult.message]
            });
        }

        const token = JwtTokenServices.generateAuthenticationToken(userResult.id);

        res.status(200).json({
            user: userResult,
            token
        });
    }

    public async checkIfTheEmailExists(req: Request, res: Response): Promise<Response> {
        // Email validation
        const value = UserValidator.email(req.query);
        // Check errors
        if (value instanceof ValidationError) {
            return res.status(422).json({
                errors: value.errors
            });
        }
        //
        const emailResult = await UserServices.checkIfTheEmailExists(value.email);
        return res.status(200).json(emailResult);
    }

    public async forgotPassword(req: Request, res: Response) {

        // Checks the email
        const value = UserValidator.email(req.body);

        // Checks the validation result
        if (value instanceof ValidationError) {
            return res.status(422).json({
                errors: value.errors
            });
        }

        const { email } = value;
        const forgotPasswordResult = await UserServices.forgotPassword(email);

        // Errors checking
        if (forgotPasswordResult instanceof ServiceError) {
            return res.status(forgotPasswordResult.code).json({
                errors: [forgotPasswordResult.message]
            })
        }

        return res.status(200).json(forgotPasswordResult);
    }

    public async checkIfPasswordResetCodeIsCorrect(req: Request, res: Response) {

        // Checks request query
        const value = UserValidator.emailAndCode(req.query);
        // Check errors
        if (value instanceof ValidationError) {
            return res.status(422).json({
                errors: value.errors
            });
        }
        // Get value
        const { email, code } = value;

        const result = await UserServices.checkIfPasswordResetCodeIsCorrect(
            email, code
        );
        // Check errors
        if (result instanceof ServiceError) {
            return res.status(200).json({ isCorrect: false });
        }

        return res.status(200).json({ isCorrect: true });
    }

    public async changePassword(req: Request, res: Response) {

        const value = UserValidator.changePassword(req.body);

        // Checks the validation result
        if (value instanceof ValidationError) {
            return res.status(422).json({
                errors: value.errors
            });
        }

        const { email, newPassword, code } = value;

        const changePasswordResult = await UserServices.changePassword(
            email, code, newPassword
        );

        if (changePasswordResult instanceof ServiceError) {
            return res.status(changePasswordResult.code).json({
                errors: [changePasswordResult.message]
            });
        }

        return res.status(200).json(changePasswordResult);
    }
}

export default new AuthenticationController();