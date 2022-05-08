
export interface IPagination {
    limit: number;
    page: number;
}

export interface ISimpleTaskQuery extends IPagination{
    priorityOrder?: 'ASC' | 'DESC';
    dueDateOrder?: 'ASC' | 'DESC';
    onlyIncompleted?: boolean;
}

export interface IQueryByYear extends ISimpleTaskQuery {
    pastTasks?: boolean
}