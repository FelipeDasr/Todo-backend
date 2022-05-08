import { IUserRecord } from '../types/UserTypes';

export enum ETaskPriority {
    LOW = 1,
    MEDIUM = 2,
    HIGHT = 3
}

export interface ITaskUser {
    user: IUserRecord
}

export interface ITask {
    title: string;
    description: string | null;
    priority: ETaskPriority,
    dueDate: Date;
    done: boolean;
    user: IUserRecord;
}

export interface IFullTaskRecord extends ITask {
    taskId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ITaskToUpdate extends
    Omit<IFullTaskRecord, 'user' | 'createdAt' | 'updatedAt'> { }

export interface ITaskInfo extends ITaskUser {
    taskId: string
}

export interface ITaskDateAndUser extends ITaskUser {
    date: Date;
}

export interface ITaskPeriodInfo extends ITaskUser {
    startDate: Date;
    limitDate: Date;
}

export interface ITaskRecord extends Omit<IFullTaskRecord, 'user'> { }

interface ITotalRecords {
    totalRecords: number;
}

export interface ITasksResponse extends ITotalRecords {
    tasks: ITaskRecord[];
}

export interface IOrganizedTaskRecord {
    [key: string]: ITaskRecord[];
}

export interface IOrganizedTaskRecordByMonth {
    [key: string]: IOrganizedTaskRecord;
}

export interface ITaskResponseOrganizedByDay extends ITotalRecords {
    tasks: IOrganizedTaskRecord | [];
}

export interface ITaskResponseOrganizedByMonth extends ITotalRecords {
    tasks: IOrganizedTaskRecordByMonth | [];
}

export interface ITaskStatistics {
    tasks: number;
    completedTasks: number;
    lateTasks: number;
    percentageOfCompletedTasks: number;
    percentageOfLateTasks: number;
}