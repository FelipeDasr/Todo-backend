import Joi from 'joi';

import { ISimpleTaskQuery, IQueryByYear } from '../types/QueryTypes';
import { IQuerySchema } from '../types/ValidatorTypes';

import { ValidationError } from '../classes/ValidationError';
import { Validator } from './Validator';

class QueryValidator extends Validator {

    private querySchema: IQuerySchema;

    constructor() {
        super();
        this.querySchema = {
            priorityOrder: Joi.string().valid('ASC', 'DESC').default('ASC'),
            dueDateOrder: Joi.string().valid('ASC', 'DESC').default('DESC'),
            onlyIncompleted: Joi.boolean().default(false),
            limit: Joi.number().integer().positive().default(50),
            page: Joi.number().integer().positive().default(1),
        }
    }

    public simpleQuery(data: any): ISimpleTaskQuery | ValidationError {
        return this.validate(data, 'optional', this.querySchema);
    }

    public queryByYear(data: any): IQueryByYear | ValidationError {
        return this.validate(data, 'optional', {
            ...this.querySchema,
            pastTasks: Joi.boolean().default(false)
        });
    }
}

export default new QueryValidator()