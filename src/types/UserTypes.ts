export interface IUser {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}

export interface IFullUserRecord extends IUser {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    tokenToChangePassword: string | undefined;
}

export interface IUserRecord
    extends Omit<IFullUserRecord, 'password' | 'tokenToChangePassword'> { };