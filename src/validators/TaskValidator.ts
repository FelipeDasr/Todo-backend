import { Validator } from "./Validator";

import { ITask, ETaskPriority, ITaskToUpdate } from "../types/TaskTypes";
import { ITaskSchema } from "../types/ValidatorTypes";

import { ValidationError } from "../classes/ValidationError";

import Joi from 'joi';

class TaskValidator extends Validator {

    private taskSchema: ITaskSchema;

    constructor() {
        super();
        this.taskSchema = {
            title: Joi.string().trim().max(150).min(1),
            description: Joi.string().trim().max(250).min(1).optional(),
            priority: Joi.string().valid(...Object.values(ETaskPriority)).optional(),
            done: Joi.boolean().optional(),
            dueDate: Joi.date().min(new Date(Date.now()))
        };
    }

    //
    public newTask(data: any): Omit<ITask, 'user'> | ValidationError {
        return this.validate(data, 'required', this.taskSchema);
    }

    public date(data: any): { date: Date } | ValidationError {
        return this.validate(data, 'required', { date: Joi.date() });
    }

    //
    public updateTask(data: any): ITaskToUpdate | ValidationError {
        return this.validate(data, 'optional', {
            taskId: Joi.string().uuid({ version: ['uuidv4'] }).required(),
            ...this.taskSchema
        });
    }

    //
    public taskId(data: any): { taskId: string } | ValidationError {
        return this.validate(data, 'required', {
            taskId: Joi.string().uuid({ version: ['uuidv4'] })
        });
    }
}

export default new TaskValidator();