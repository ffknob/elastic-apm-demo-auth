import passport from 'passport';

import {
    Strategy,
    StrategyOptions,
    VerifyCallback,
    Profile
} from 'passport-github';

import { User, LoggerService } from '@ffknob/elastic-apm-demo-shared';

import { users } from '../passport';

const strategyOptions: StrategyOptions = {
    clientID: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    callbackURL: process.env.GITHUB_CALLBACK_URL || ''
};

const strategy = (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
) => {
    console.log(accessToken);
    console.log(profile);

    LoggerService.logger.debug(`User profile: ` + profile);

    let user: User | undefined = users.find(
        (user: User) => user.google && user.google.id === profile.id
    );

    if (!user) {
        const email: string | undefined = profile.emails
            ? profile.emails[0].value
            : undefined;

        user = {
            _id: '1234',
            name: profile.displayName,
            username: profile.username || email,
            email: email,
            token: accessToken,
            tokenExpirationDate: new Date(),
            image: '/images/user/1234.png'
        };

        users.push(user);
    }

    done(undefined, user);
};

export const GithubStrategy = new Strategy(strategyOptions, strategy);
