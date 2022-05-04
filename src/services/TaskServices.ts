import { Repository, getRepository, Between } from 'typeorm';
import { Task } from '../entities/Task.entity';

import {
    ITaskResponseOrganizedByMonth,
    IOrganizedTaskRecordByMonth,
    ITaskResponseOrganizedByDay,
    IDeleteAllTasksResponse,
    IOrganizedTaskRecord,
    ITaskDateAndUser,
    IFullTaskRecord,
    ITaskPeriodInfo,
    ITasksResponse,
    ITaskToUpdate,
    ITaskRecord,
    ITaskUser,
    ITaskInfo,
    ITask,
} from '../types/TaskTypes';

import { IQueryByYear, ISimpleTaskQuery } from '../types/QueryTypes';
import { ISimpleMessage } from '../types/CommonTypes';
import { IUserRecord } from '../types/UserTypes';
import { ServiceError } from '../classes/ServiceError';

import moment from 'moment';
import { paginate } from '../utils';

class TaskServices {

    constructor(private taskRepository: Repository<Task> = getRepository(Task)) { }

    public async createNewTask(task: ITask): Promise<ITaskRecord | ServiceError> {
        try {
            // Checks if the task already exists
            const taskAlreadyExist = await this.taskRepository.findOne({
                where: { title: task.title, dueDate: task.dueDate }
            });

            if (taskAlreadyExist) return new ServiceError('the task already exists', 400);

            // Create the new Task
            const newTask = await this.taskRepository.save(task);
            return this.taskReturn(newTask);
        }
        catch (e) {
            return new ServiceError('Error when trying to create a new task', 500);
        }
    }

    public async getTasksByDate(taskInfo: ITaskDateAndUser, query: ISimpleTaskQuery): (
        Promise<ServiceError | ITasksResponse>
    ) {
        try {
            const { date, user } = taskInfo;

            // Exemple
            // Date: 08/10/2023 00:00:00
            // date limit 1: 07/10/2023 23:59:59
            // date limit 2: 09/10/2023 00:00:00
            const startDate = moment(date).subtract(1, 'day').endOf('day');
            const limitDate = moment(date).add(1, 'day').startOf('day')

            const tasksResult = await this.getTaskByTimePeriod(
                {
                    startDate: startDate.toDate(),
                    limitDate: limitDate.toDate(),
                    user
                },
                query
            );

            if (tasksResult instanceof ServiceError) return tasksResult;
            return tasksResult; // Returns
        }
        catch (e) {
            return new ServiceError('Error when trying to get the tasks', 500);
        }
    }

    public async getTasksOfTheMonth(taskInfo: ITaskDateAndUser, query: ISimpleTaskQuery): (
        Promise<ServiceError | ITaskResponseOrganizedByDay>
    ) {
        try {
            const { date, user } = taskInfo;

            // Exemple
            // Date: 08/07/2023 00:00:00
            // start date: 30/06/2023 23:59:59
            // limit date: 01/08/2023 00:00:00
            const startDate = moment(date).subtract(1, 'months').endOf('month');
            const limitDate = moment(date).add(1, 'month').startOf('month');

            const tasksResult = await this.getTaskByTimePeriod(
                {
                    startDate: startDate.toDate(),
                    limitDate: limitDate.toDate(),
                    user
                },
                query
            );

            if (tasksResult instanceof ServiceError) return tasksResult;
            const { totalRecords } = tasksResult;

            return {
                tasks: this.getTasksOrganizedByDay(tasksResult.tasks),
                totalRecords
            }; // Returns
        }
        catch (e) {
            return new ServiceError('Error when trying to get the tasks', 500);
        }
    }

    public async getTasksOfTheYear(taskInfo: ITaskUser, query: IQueryByYear): (
        Promise<ITaskResponseOrganizedByMonth | ServiceError>
    ) {
        try {
            // Set parameters
            let startDate: moment.Moment, limitDate: moment.Moment;

            if (query.pastTasks) {
                // Full year
                startDate = moment().subtract(1, 'year').endOf('year');
                limitDate = moment().add(1, 'year').startOf('year');
            }
            else {
                // From now on
                startDate = moment().subtract(1, 'day').endOf('day');
                limitDate = moment().add(1, 'year').startOf('year');
            }

            const tasksResult = await this.getTaskByTimePeriod(
                {
                    startDate: startDate.toDate(),
                    limitDate: limitDate.toDate(),
                    user: taskInfo.user
                },
                query
            );

            if (tasksResult instanceof ServiceError) return tasksResult;
            const { totalRecords } = tasksResult;

            return {
                tasks: this.getTasksOrganizedByMonth(tasksResult.tasks),
                totalRecords
            }
        }
        catch (e) {
            return new ServiceError('Error when trying to get the tasks of the year', 500);
        }
    }

    public async updateTask(taskInfo: ITaskInfo, task: ITaskToUpdate): (
        Promise<ISimpleMessage | ServiceError>
    ) {
        try {
            // Update the task
            const taskUpdateResult = await this.taskRepository.update(taskInfo, task);
            // Checks if the task has been updated
            if (!taskUpdateResult.affected) return new ServiceError('Task does not exist', 400);
            // returns success message
            return { message: 'Successful task update' }
        }
        catch (e) {
            return new ServiceError('Error when trying to update task', 500);
        }
    }

    public async deleteTask(taskInfo: ITaskInfo): Promise<ISimpleMessage | ServiceError> {
        try {
            // Delete the task
            const deleteTaskResult = await this.taskRepository.delete(taskInfo);
            // Checks if the task has been deleted
            if (!deleteTaskResult.affected) return new ServiceError('Task does not exist', 400);
            // returns success message
            return { message: 'Successful task deletion' }
        }
        catch (e) {
            return new ServiceError('Error when trying to delete task', 500);
        }
    }

    public async deleteAllTasks(user: IUserRecord): Promise<IDeleteAllTasksResponse | ServiceError> {
        try {
            // Delete all tasks
            const result = await this.taskRepository.delete({ user });
            return {
                affected: result.affected
            }
        }
        catch (e) {
            return new ServiceError('Error when trying to delete all tasks', 500);
        }
    }

    public async getTaskByTimePeriod(taskInfo: ITaskPeriodInfo, query: ISimpleTaskQuery): (
        Promise<ServiceError | ITasksResponse>
    ) {
        try {
            const { user, startDate, limitDate } = taskInfo;

            // Filter the tasks by task.done
            const doneQuery = {};
            if (query.onlyIncompleted) doneQuery['done'] = false;

            // Pagination
            const { perPage, offset } = paginate(query.limit, query.page);
            // Get tasks
            const tasksResult = await this.taskRepository.findAndCount({
                where: {
                    dueDate: Between(startDate, limitDate),
                    user: user.id,
                    ...doneQuery
                },
                order: query.priorityOrder ? { priority: query.priorityOrder } : { dueDate: 'ASC' },
                take: perPage, skip: offset,
            });
            //
            return { tasks: tasksResult[0], totalRecords: tasksResult[1] };
        }
        catch (e) {
            return new ServiceError('Error when trying to get tasks by period', 500);
        }
    }

    public async getTaskById(taskId: string): Promise<ITaskRecord | ServiceError> {
        try {
            // Get task
            const task = await this.taskRepository.findOne(taskId);
            // Check if the task exist
            if (!task) {
                return new ServiceError('Task does not exist', 400);
            }

            return task;
        }
        catch (e) {
            return new ServiceError('Error when trying to get the task', 500);
        }
    }

    private getTasksOrganizedByMonth(tasks: ITaskRecord[]): IOrganizedTaskRecordByMonth | [] {

        if (!tasks.length) return [];
        const tasksOrganizedByMonth: IOrganizedTaskRecordByMonth = {};

        for (let taskIndex in tasks) {
            // Get the dates
            const taskDay = tasks[taskIndex].dueDate;
            const dateOfTheDay = moment(taskDay).format('YYYY-MM-DD');
            const month = moment(taskDay).get('month').toString();

            // Checks if the index month does not exist
            if (!tasksOrganizedByMonth[month]) tasksOrganizedByMonth[month] = {};
            // Checks if the index day does not exist
            if (!tasksOrganizedByMonth[month][dateOfTheDay]) tasksOrganizedByMonth[month][dateOfTheDay] = [];

            // Add task to => { "month": { "day": [] } }
            tasksOrganizedByMonth[month][dateOfTheDay].push(tasks[taskIndex]);
        }
        //
        return tasksOrganizedByMonth;
    }

    private getTasksOrganizedByDay(tasks: ITaskRecord[]): IOrganizedTaskRecord | [] {

        if (!tasks.length) return [];
        const tasksOrganizedByDay: IOrganizedTaskRecord = {}; // Return object

        for (let taskIndex in tasks) {
            // Get the dates
            const taskDay = tasks[taskIndex].dueDate;
            const day = moment(taskDay).format('YYYY-MM-DD');

            // Checks if the index does not exist 
            if (!tasksOrganizedByDay[day]) tasksOrganizedByDay[day] = [];
            // Add the task to the list
            tasksOrganizedByDay[day].push(tasks[taskIndex]);
        }
        //
        return tasksOrganizedByDay;
    }

    private taskReturn(task: IFullTaskRecord): ITaskRecord {
        // Returns the task record without user data
        return {
            taskId: task.taskId,
            title: task.title,
            description: task.description,
            priority: task.priority,
            done: task.done,
            dueDate: task.dueDate,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
        }
    }
}

export default new TaskServices();