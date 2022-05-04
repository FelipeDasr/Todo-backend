import { Request, Response } from 'express';

import TaskServices from '../services/TaskServices';
import UserServices from '../services/UserServices';

import { IUserRecord } from '../types/UserTypes';

import { ServiceError } from '../classes/ServiceError';

class UserController {
    public async deleteUser(req: Request, res: Response): Promise<Response> {
        // Get user
        const user: IUserRecord = res.locals.user;

        // Delete all user tasks
        const deleteAllUserTasksResult = await TaskServices.deleteAllUserTasks(user);
        // Check errors
        if (deleteAllUserTasksResult instanceof ServiceError){
            return res.status(deleteAllUserTasksResult.code).json({
                errors: [deleteAllUserTasksResult.message]
            });
        }

        // Delete user
        const deleteUserResult = await UserServices.deleteUser(user.id);
        // Check errors
        if (deleteUserResult instanceof ServiceError){
            return res.status(deleteUserResult.code).json({
                errors: [deleteUserResult.message]
            });
        }

        return res.status(200).json({
            deletedUser: user,
            deletedTasks: deleteAllUserTasksResult.affected
        });
    }
}

export default new UserController();