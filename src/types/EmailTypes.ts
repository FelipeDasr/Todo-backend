
export interface ITargetInfo {
    firstname: string; 
    lastname: string;
}

export interface IResetPasswordInfo extends ITargetInfo {
    code: string
}

export interface IEmailPayload {
    to: string;
    subject: string;
    html: string
}