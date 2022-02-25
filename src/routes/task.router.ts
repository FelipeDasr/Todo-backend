import { Router } from 'express';
const taskRouter = Router();

import TaskController from '../controllers/Task.controller';

taskRouter.post('/task', TaskController.newTask);

taskRouter.get('/tasks_of_the_year', TaskController.getTasksOfTheYear);
taskRouter.get('/tasks_of_the_month', TaskController.getTasksOfTheMonth);
taskRouter.get('/tasks_of_the_day', TaskController.getTasksOfTheDay);

taskRouter.patch('/task/update', TaskController.updateTask);
taskRouter.delete('/task/delete/:taskId', TaskController.deleteTask);

export { taskRouter }