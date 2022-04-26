import nodemailer, { Transporter } from 'nodemailer';

import Handlebars from 'handlebars';
import fs from 'fs';

import { ITargetInfo, IEmailPayload, IResetPasswordInfo } from '../types/EmailTypes';

class EmailService {

    private transporter: Transporter;
    private from: string;

    private resetPasswordTemplateFile: string;
    private welcomeTemplateFile: string;

    constructor() {
        // Create transporter
        this.transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            host: process.env.EMAIL_HOST,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Loading templates
        this.resetPasswordTemplateFile = fs.readFileSync(__dirname + '/../views/ResetPassword.hbs', 'utf-8');
        this.welcomeTemplateFile = fs.readFileSync(__dirname + '/../views/Welcome.hbs', 'utf-8');
        // Set origin
        this.from = `Todo team <${process.env.EMAIL_USER}>`;
    }

    public async sendWelcomeEmail(to: string, nameInfo: ITargetInfo) {
        // Compile the template
        const welcomeTemplate = Handlebars.compile(this.welcomeTemplateFile);
        // Send email
        this.sendEmail({
            subject: "Welcome to Todo",
            html: welcomeTemplate(nameInfo),
            to
        });
    }

    public sendResetPasswordEmail(to: string, target: IResetPasswordInfo): void {
        // Compile the template
        const ResetPasswordTemplate = Handlebars.compile(this.resetPasswordTemplateFile);
        // Send email
        this.sendEmail({
            subject: "Todo password reset",
            html: ResetPasswordTemplate(target),
            to
        });
    }

    private sendEmail(payload: IEmailPayload) {
        try{
            this.transporter.sendMail({ from: this.from, ...payload });
        }
        catch(e){
            console.log(e);
        }
    }
}

export default new EmailService();