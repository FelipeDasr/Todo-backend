import { Request, Response, NextFunction } from 'express';

import JwtTokenServices from '../services/JwtTokenServices';
import UserServices from '../services/UserServices';

import { ServiceError } from '../classes/ServiceError';

export async function authChecker(req: Request, res: Response, next: NextFunction) {
    try {

        // Bearer token validation 1
        if (!req.headers.authorization) {
            return res.status(401).json({ errors: ['Authentication is required'] });
        }
        const jwtTokenSplited = req.headers.authorization.split(' ');
        // Bearer token validation 2
        if (jwtTokenSplited[0] !== 'Bearer' || jwtTokenSplited.length !== 2) {
            return res.status(401).json({ errors: ['Invalid bearer token'] });
        }
        
        const token = jwtTokenSplited[1];
        const userId = JwtTokenServices.getUserIdByToken(token);

        // Check code errors
        if(userId instanceof ServiceError){
            return res.status(userId.code).json({ 
                errors: [userId.message] 
            });
        }

        // Get the user
        const userResult = await UserServices.getUserById(userId);

        if(userResult instanceof ServiceError){
            return res.status(401).json({
                errors: [`Access token validation error: ${userResult.message}`]
            });
        }

        // Defining the user who made the request
        res.locals.user = userResult;

        return next();
    }
    catch (e) {
        return res.status(500).json({
            errors: ['Error when trying to verify user authentication']
        });
    }
}