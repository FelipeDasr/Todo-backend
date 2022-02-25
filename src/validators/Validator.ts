import {
    TValidationErrorsResult,
    IValidationResult,
    TPresence
} from '../types/ValidatorTypes';

import { ValidationError } from '../classes/ValidationError';

import Joi, { date } from 'joi';

export class Validator {

    protected validate(data: any, presence: TPresence, partialSchema: any): (
        any | ValidationError
    ) {

        const { value, error } = Joi.object(partialSchema).validate(data, {
            allowUnknown: true,
            stripUnknown: true,
            abortEarly: false,
            presence,
        });

        return this.returnErrorOrSuccess(value, this.getErrors(error));
    }

    private returnErrorOrSuccess(value: any, error: TValidationErrorsResult | undefined): (
        any | ValidationError
    ) {
        if (Object.keys(value).length === 0) {
            return new ValidationError(['Cannot handle empty data']);
        }
        if (error) return new ValidationError(error);
        return value;
    }

    private getErrors(errors: Joi.ValidationError): TValidationErrorsResult {
        if (!errors) return undefined;
        return errors.details.map(e => e.message)
    }
}