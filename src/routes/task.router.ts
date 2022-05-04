import { Router } from 'express';
const taskRouter = Router();

import TaskController from '../controllers/Task.controller';

import { authChecker } from '../middlewares/authChecker'

taskRouter.post('/task', authChecker, TaskController.newTask);

taskRouter.get('/task/:taskId', authChecker, TaskController.getTaskById);
taskRouter.get('/tasks_of_the_year', authChecker, TaskController.getTasksOfTheYear);
taskRouter.get('/tasks_of_the_month', authChecker, TaskController.getTasksOfTheMonth);
taskRouter.get('/tasks_of_the_day', authChecker, TaskController.getTasksOfTheDay);

taskRouter.patch('/task/update', authChecker, TaskController.updateTask);
taskRouter.delete('/task/delete/:taskId', authChecker, TaskController.deleteTask);

export { taskRouter }