import Joi, { string } from 'joi';

export interface IValidationResult {
    value: any;
    error: TValidationErrorsResult;
}

export interface IUserSchema {
    firstname: Joi.StringSchema;
    lastname: Joi.StringSchema;
    email: Joi.StringSchema;
    password: Joi.StringSchema;
}

export interface ITaskSchema {
    title: Joi.StringSchema;
    description: Joi.StringSchema;
    done: Joi.BooleanSchema;
    priority: Joi.StringSchema;
    dueDate: Joi.DateSchema;
}

export interface IQuerySchema {
    priorityOrder: Joi.StringSchema;
    dueDateOrder: Joi.StringSchema;
    onlyIncompleted: Joi.BooleanSchema;
    limit: Joi.NumberSchema;
    page: Joi.NumberSchema;
}

export type TValidationErrorsResult = string[] | undefined;
export type TPresence = 'required' | 'optional';

