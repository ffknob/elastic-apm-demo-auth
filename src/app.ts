import * as dotenv from 'dotenv';
dotenv.config();

import {
    ApmService,
    LoggerService,
    BackendError,
    GenericError
} from '@ffknob/elastic-apm-demo-shared';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import session from 'express-session';
import expressWinston from 'express-winston';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import winston from 'winston';

import * as uuid from 'uuid';
import passport from 'passport';

import { passportConfig } from './passport';

import authRoutes from './routes/auth';

const apmService = ApmService.getInstance();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    expressWinston.logger({
        transports: [new winston.transports.Console()],
        meta: false,
        msg: 'HTTP {{req.method}} {{req.url}}',
        expressFormat: true,
        colorize: false
    })
);

app.use(
    expressWinston.errorLogger({
        transports: [new winston.transports.Console()]
    })
);

app.use(cors({ origin: '*' }));
app.use(
    session({
        genid: (req: Request) => uuid.v4(),
        //store: new MongoStore
        //store: new RedisStore
        secret: process.env.SESSION_SECRET || 'secret',
        resave: false,
        saveUninitialized: true
    })
);
app.use(passport.initialize());
app.use(passport.session());
passportConfig.init();

app.use(authRoutes);

app.use(
    (
        err: GenericError<any>,
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        LoggerService.logger.error(err.message);

        apmService.captureError(err.message!);

        const backendError: BackendError<GenericError<any>> = {
            id: res.locals.id,
            success: false,
            statusCode: err.code ? +err.code : 500,
            statusMessage: err.message || 'Internal Server Error',
            metadata: res.locals.metadata,
            data: err
        };

        res.status(err.code ? +err.code : 500).json(backendError);
    }
);

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
