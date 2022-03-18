import jwt from 'jsonwebtoken';

import { ServiceError } from '../classes/ServiceError';

class JwtTokenServices {

    public generateAuthenticationToken(userId: string): string {
        return jwt.sign(
            { id: userId },
            process.env.API_TOKEN,
            { expiresIn: '24h' }
        );
    }

    public generateTokenToChangePassword(code: string) {
        return jwt.sign(
            { code }, process.env.API_TOKEN, { expiresIn: '5m' }
        );
    }

    public isTheSameCode(code: string, token: string): true | ServiceError {
        let serviceError: ServiceError;

        // Checks if the code is the same inside of the payload
        jwt.verify(token, process.env.API_TOKEN, (err, payload: { code: string }) => {
            if (err) {
                serviceError = this.getJwtError(err);
                return;
            }
            if (payload.code !== code) serviceError = new ServiceError('Incorrect code', 401);
        });
        return serviceError ? serviceError : true;
    }

    public getUserIdByToken(token: string): string | ServiceError {
        let serviceError: ServiceError;
        let userId: string;

        jwt.verify(token, process.env.API_TOKEN, (err, payload: { id: string }) => {
            if (err) return serviceError = this.getJwtError(err);
            userId = payload.id;
        });

        return serviceError ? serviceError : userId;
    }

    private getJwtError(error: jwt.VerifyErrors) {
        switch (error.name) {
            case 'TokenExpiredError':
                return new ServiceError('Expired token', 401);

            case 'JsonWebTokenError':
                return new ServiceError('Malformed token', 401);

            case 'NotBeforeError':
                return new ServiceError('Inactive token', 401);

            default:
                console.log('HERE 4321')
                return new ServiceError('Invalid token', 401);
        }
    }
}

export default new JwtTokenServices();