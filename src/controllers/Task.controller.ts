import { Request, Response } from 'express';

import { ValidationError } from '../classes/ValidationError';
import { ServiceError } from '../classes/ServiceError';

import TaskValidator from '../validators/TaskValidator';
import TaskServices from '../services/TaskServices';

import { IUserRecord } from '../types/UserTypes';
import QueryValidator from '../validators/QueryValidator';

class TaskController {

    public async newTask(req: Request, res: Response): Promise<Response> {

        // Body validation
        const value = TaskValidator.newTask(req.body);
        // Checks the validation result
        if (value instanceof ValidationError) {
            return res.status(422).json({ errors: value.errors });
        }

        // Get user
        const user = res.locals.user;
        // Create the new task
        const newTaskResult = await TaskServices.createNewTask({ ...value, user });

        if (newTaskResult instanceof ServiceError) {
            return res.status(newTaskResult.code).json({
                errors: [newTaskResult.message]
            });
        }
        //
        return res.status(200).json(newTaskResult);
    }

    public async getTasksOfTheDay(req: Request, res: Response) {

        const queryValue = QueryValidator.simpleQuery(req.query); // Filters validation
        const value = TaskValidator.date(req.query);     // Query validation

        // Checks the validation result
        if (value instanceof ValidationError)
            return res.status(422).json({ errors: value.errors });
        if (queryValue instanceof ValidationError)
            return res.status(422).json({ errors: queryValue.errors });

        const user = res.locals.user; // Get user
        const date = value.date;

        // Get tasks
        const tasksResult = await TaskServices.getTasksByDate({ date, user }, queryValue);
        // Checks errors
        if (tasksResult instanceof ServiceError) {
            return res.status(tasksResult.code).json({ errors: [tasksResult.message] });
        }

        return res.status(200).json(tasksResult);
    }

    public async getTasksOfTheMonth(req: Request, res: Response): Promise<Response> {
        // Data validation
        const queryValue = QueryValidator.simpleQuery(req.query); // Filters validation
        const value = TaskValidator.date(req.query);     // Query validation

        // Checks the validation result
        if (value instanceof ValidationError)
            return res.status(422).json({ errors: value.errors });
        if (queryValue instanceof ValidationError)
            return res.status(422).json({ errors: queryValue.errors });

        const user = res.locals.user; // Get user
        const date = value.date;

        // Get tasks
        const tasksResult = await TaskServices.getTasksOfTheMonth({ date, user }, queryValue);
        // Checks errors
        if (tasksResult instanceof ServiceError) {
            return res.status(tasksResult.code).json({ errors: [tasksResult.message] });
        }

        return res.status(200).json(tasksResult);
    }

    public async getTasksOfTheYear(req: Request, res: Response) {
        // Data validation
        const queryValue = QueryValidator.queryByYear(req.query); // Filters validation
        const value = TaskValidator.date(req.query);     // Query validation

        // Checks the validation result
        if (value instanceof ValidationError)
            return res.status(422).json({ errors: value.errors });
        if (queryValue instanceof ValidationError)
            return res.status(422).json({ errors: queryValue.errors });

        // Get data
        const user = res.locals.user; // Get user

        const tasksResult = await TaskServices.getTasksOfTheYear({ user }, queryValue);

        // Checks errors
        if (tasksResult instanceof ServiceError) {
            return res.status(tasksResult.code).json({ errors: [tasksResult.message] })
        }
        //
        return res.status(200).json(tasksResult);
    }

    public async getTaskById(req: Request, res: Response) {
        // Check params
        const value = TaskValidator.taskId(req.params);
        // Check errors
        if (value instanceof ValidationError) {
            return res.status(422).json({
                errors: value.errors
            });
        }

        // Get task
        const taskResult = await TaskServices.getTaskById(value.taskId);
        // Check errors
        if (taskResult instanceof ServiceError) {
            return res.status(taskResult.code).json({
                errors: [taskResult.message]
            });
        }

        return res.status(200).json(taskResult);
    }

    public async getTasksStatistics(req: Request, res: Response): Promise<Response> {
        // Get user
        const user: IUserRecord = res.locals.user;
        // Get statistics
        const tasksStatsResult = await TaskServices.getTaskStats(user);
        // Check errors
        if (tasksStatsResult instanceof ServiceError) {
            return res.status(tasksStatsResult.code).json({
                errors: [tasksStatsResult.message]
            });
        }

        return res.status(200).json(tasksStatsResult);
    }

    public async updateTask(req: Request, res: Response): Promise<Response> {

        // Body validation
        const value = TaskValidator.updateTask(req.body);
        // Checks the validation result
        if (value instanceof ValidationError) {
            return res.status(422).json({ errors: value.errors });
        }

        // Get user
        const user: IUserRecord = res.locals.user;
        const { taskId } = value;

        // Update task
        const taskUpdateResult = await TaskServices.updateTask({ user, taskId }, value);
        // Checks errors
        if (taskUpdateResult instanceof ServiceError) {
            return res.status(taskUpdateResult.code).json({ errors: [taskUpdateResult.message] });
        }

        return res.status(200).json(taskUpdateResult);
    }

    public async deleteTask(req: Request, res: Response): Promise<Response> {

        // Body validation
        const value = TaskValidator.taskId(req.params);
        // Checks the validation result
        if (value instanceof ValidationError) {
            return res.status(422).json({ errors: value.errors });
        }

        const user: IUserRecord = res.locals.user; // Get user
        const { taskId } = value;

        // Delete task
        const taskDeleteResult = await TaskServices.deleteTask({ user, taskId });
        // Checks errors
        if (taskDeleteResult instanceof ServiceError) {
            return res.status(taskDeleteResult.code).json({ errors: [taskDeleteResult.message] });
        }

        return res.status(200).json(taskDeleteResult);
    }
}

export default new TaskController();