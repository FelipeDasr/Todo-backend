import nodemailer, { Transporter } from 'nodemailer';
import fs from 'fs';

class EmailService {

    private transporter: Transporter;
    private from: string;

    private resetPasswordTemplate: string;
    private welcomeTemplate: string;

    constructor() {

        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Loading templates
        this.resetPasswordTemplate = fs.readFileSync(__dirname + '/../views/ResetPassword.hbs', 'utf-8');
        this.welcomeTemplate = fs.readFileSync(__dirname + '/../views/Welcome.hbs', 'utf-8');

        this.from = `ToDo team <${process.env.EMAIL_USER}>`;
    }

    public async sendWelcomeEmail(to: string, nameInfo: { firstname: string, lastname: string }) {
        try {

        }
        catch(e){
            
        }
    }
}

export default new EmailService();