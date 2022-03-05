import { getRepository, Repository } from 'typeorm';
import { User } from '../entities/User.entity';

import { ServiceError } from '../classes/ServiceError';

import JwtTokenServices from './JwtTokenServices';
import bcrypt from 'bcryptjs';

import { IUserRecord, IFullUserRecord, IUser, } from '../types/UserTypes';
import { ISimpleMessage } from '../types/CommonTypes';

import { generateRandomNumbersInString, textToHash } from '../utils';
import EmailServices from './EmailServices';
import { resolve } from 'path';

class UserServices {

    private userRepository: Repository<User>;
    private allUserProperties: (keyof User)[];

    constructor() {
        this.userRepository = getRepository(User);
        this.allUserProperties = [
            'id',
            'firstname',
            'lastname',
            'email',
            'password',
            'tokenToChangePassword',
            'createdAt',
            'updatedAt',
        ]
    }

    public async createNewUser(user: IUser): Promise<IUserRecord | ServiceError> {
        try {
            // Searching the same email in database
            const userAlreadyExist = await this.checkIfTheEmailExists(user.email);
            if (userAlreadyExist instanceof ServiceError) return userAlreadyExist; // Check errors

            // Errors checking
            if (userAlreadyExist.exists) {
                return new ServiceError('E-mail is already in use', 400);
            }

            // save password as hash
            user.password = textToHash(user.password);

            // Save the new user
            const newUser = await this.userRepository.save(user);

            EmailServices.sendWelcomeEmail(newUser.email, {
                firstname: newUser.firstname,
                lastname: newUser.lastname
            });

            return this.userReturn(newUser);
        }
        catch (e) {
            return new ServiceError('Error when trying to create a new user', 500);
        }
    }

    public async getUserByEmailAndPassword(email: string, password: string): (
        Promise<IUserRecord | ServiceError>
    ) {
        try {
            // Checks if the user exists
            const user = await this.getUserRecordByEmail(email);

            // Errors checking
            if (user instanceof ServiceError) return user;

            // Verify if the password is correct
            const isTheSamePassword = bcrypt.compareSync(password, user.password);
            if (!isTheSamePassword) return new ServiceError(
                'Email or password is incorrect', 401
            );

            return this.userReturn(user);
        }
        catch (e) {
            return new ServiceError('Error when trying to verify the user', 500);
        }
    }

    public async forgotPassword(email: string): Promise<ISimpleMessage | ServiceError> {
        try {
            const user = await this.getUserRecordByEmail(email);
            if (user instanceof ServiceError) return user;

            const code = generateRandomNumbersInString(5);
            const token = JwtTokenServices.generateTokenToChangePassword(code);

            await this.userRepository.update(
                { id: user.id },
                { tokenToChangePassword: token }
            );

            // Send reset password email
            EmailServices.sendResetPasswordEmail(user.email, {
                firstname: user.firstname,
                lastname: user.lastname,
                code
            });

            return {
                message:
                    `Success, an email with the verification code, has been sent to: ${user.email}`
            }
        }
        catch (e) {
            return new ServiceError(
                'Error when trying to generate the code to change password', 500
            );
        }
    }

    public async changePassword(email: string, code: string, newPassword: string): (
        Promise<ISimpleMessage | ServiceError>
    ) {
        try {
            const user = await this.getUserRecordByEmail(email);
            if (user instanceof ServiceError) return user;

            if (!user.tokenToChangePassword) {
                return new ServiceError('Make a request to change the password', 400);
            }

            // Checks if the code is correct
            const isTheSameCode = JwtTokenServices.isTheSameCode(
                code, user.tokenToChangePassword
            );

            // Verify errors
            if (isTheSameCode instanceof ServiceError) return new ServiceError(
                isTheSameCode.message, isTheSameCode.code
            );

            // Update user
            await this.userRepository.update({ email }, {
                password: textToHash(newPassword),
                tokenToChangePassword: null
            });
            //
            return { message: 'Successful password change' }
        }
        catch (e) {
            return new ServiceError('Error when trying to change the password', 500);
        }
    }

    public async getUserById(id: string): Promise<IUserRecord | ServiceError> {
        try {
            // Get user
            const user = await this.userRepository.findOne(id);
            //
            if (!user) return new ServiceError('User does not exist', 500);
            return user;
        }
        catch (e) {
            return new ServiceError('Error when trying to verify the user', 500);
        }
    }

    public async checkIfTheEmailExists(email: string): (
        Promise<{ exists: boolean } | ServiceError>
    ) {
        try {
            // Get user
            const user = await this.userRepository.findOne({ email });
            //
            if (!user) return { exists: false }
            return { exists: true }
        }
        catch (e) {
            return new ServiceError('Error when trying to verify email', 500);
        }
    }

    private async getUserRecordByEmail(email: string): Promise<IFullUserRecord | ServiceError> {
        try {
            const user = await this.userRepository.findOne({
                where: { email },
                select: this.allUserProperties
            });

            if (!user) return new ServiceError('User does not exist', 500);
            return user;
        }
        catch (e) {
            return new ServiceError('Error when trying to verify the user', 500);
        }
    }

    private userReturn(user: IFullUserRecord): IUserRecord {
        // Returns IUserRecord without the password and tokenToChangePassword property
        return {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    }
}

export default new UserServices();