import { Request, Response, NextFunction } from 'express';

import JwtTokenServices from '../services/JwtTokenServices';
import UserServices from '../services/UserServices';

import { ServiceError } from '../classes/ServiceError';

export async function refreshTokenChecker(req: Request, res: Response, next: NextFunction) {
    try {
        const { refreshToken } = req.body;
        // Check if the refresh token exist
        if (!refreshToken) {
            return res.status(422).json({
                errors: ['"refreshToken" is required']
            });
        }
        // Get the user id
        const userIdResult = JwtTokenServices.getUserIdByToken(
            refreshToken, process.env.REFRESH_RECRET_TOKEN
        );
        // Check if the token is valid             
        if (userIdResult instanceof ServiceError) {
            return res.status(userIdResult.code).json({
                errors: [userIdResult.message]
            });
        }

        // Get user
        const userResult = await UserServices.getUserById(userIdResult);
        // Check if the user exist
        if (userResult instanceof ServiceError) {
            return res.status(userResult.code).json({
                errors: [`Refresh token validation error: ${userResult.message}`]
            });
        }

        // Defining the user who made the request
        res.locals.user = userResult;

        return next();
    }
    catch (e) {
        return res.status(500).json({
            errors: ['Error when trying to verify the refresh token']
        });
    }
}