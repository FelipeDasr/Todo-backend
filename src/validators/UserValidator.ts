import { Validator } from "./Validator";
import Joi from 'joi';

import { IUserSchema } from "../types/ValidatorTypes";
import { IUser } from '../types/UserTypes';

import { ValidationError } from "../classes/ValidationError";

class UserValidator extends Validator {

    private schema: IUserSchema;

    constructor() {
        super();
        this.schema = {
            firstname: Joi.string().min(2).max(50),
            lastname: Joi.string().min(2).max(50),
            email: Joi.string().email().max(100),
            password: Joi.string().min(6).max(200)
        }
    }

    //
    public user(data: any): IUser | ValidationError {
        return this.validate(data, 'required', this.schema);
    }

    //
    public userSignin(data: any): ({ email: string; password: string; } | ValidationError) {
        return this.validate(data, 'required', {
            email: this.schema.email,
            password: this.schema.password
        });
    }

    //
    public email(data: any): ({ email: string } | ValidationError) {
        return this.validate(data, 'required', { email: this.schema.email });
    }

    //
    public changePassword(data: any): (
        { email: string; newPassword: string, code: string } | ValidationError
    ) {
        return this.validate(data, 'required', {
            email: this.schema.email,
            newPassword: this.schema.password,
            code: Joi.string().length(5)
        });
    }
}

export default new UserValidator();