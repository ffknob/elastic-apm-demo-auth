import passport from 'passport';

import {
    IStrategyOptions as StrategyOptions,
    Strategy,
    VerifyFunction,
    IVerifyOptions
} from 'passport-local';

import {
    User,
    SignInProvider,
    LoggerService
} from '@ffknob/elastic-apm-demo-shared';

import { DataService } from '../../services';

const provider: SignInProvider = 'local';

const strategyOptions: StrategyOptions = {
    usernameField: 'username'
};

const strategy: VerifyFunction = (
    email: string,
    password: string,
    done: (error: any, user?: any, options?: IVerifyOptions) => void
) => {
    let user: User | undefined = DataService.findLocalUser(email, password);

    if (user) {
        if (user.password === '1234') {
            user = {
                _id: '1234',
                name: 'Flávio Franco Knob',
                username: 'ffknob',
                email: 'ffknob@gmail.com'
            };

            DataService.addUser(user);

            done(undefined, user);
        }
    }

    done('ERRO');
};

export const LocalStrategy = new Strategy(strategyOptions, strategy);
