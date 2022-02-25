export class ServiceError extends Error {
    constructor(msg: string, public code: number) {
        super(msg);
    }
}