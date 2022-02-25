if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

import 'reflect-metadata';
import DBConnection from './database';

import express from 'express';
const app = express();

DBConnection.then(async connection => {

    const { router } = await import('./routes');

    app.use(express.json());
    app.use(router);

    const appPort = process.env.API_PORT || 3000;

    app.listen(appPort, () => {
        console.log(
            `\x1b[42m[OK]\x1b[0m API IS RUNNING AT http://127.0.0.1:${appPort}\n\n` +
            '\x1b[42m[OK]\x1b[0m CONNECTION TO DATABASE SUCCESSFUL'
        );
    });

}).catch(err => {
    console.log(
        `\x1b[31m[ERROR]\x1b[0m DATABASE ERROR: ${err} ${err.stack}`
    );
});