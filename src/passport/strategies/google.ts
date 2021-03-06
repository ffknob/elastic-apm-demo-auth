import passport from 'passport';

import {
    Strategy,
    StrategyOptions,
    VerifyCallback,
    Profile
} from 'passport-google-oauth20';

import {
    User,
    SignInProvider,
    LoggerService
} from '@ffknob/elastic-apm-demo-shared';

import { DataService } from '../../services';

const provider: SignInProvider = 'google';

const strategyOptions: StrategyOptions = {
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || ''
};

const strategy = (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
) => {
    LoggerService.logger.debug(
        `User profile with id ${profile.id} at ${provider}`
    );

    let user: User | undefined = DataService.findProviderUser(
        profile.id,
        provider
    );

    if (!user) {
        const email: string | undefined = profile.emails
            ? profile.emails[0].value
            : undefined;

        const image: string | undefined = profile.photos
            ? profile.photos[0].value
            : undefined;

        user = {
            _id: '1234',
            name: profile.displayName,
            username: profile.username || email,
            email,
            token: accessToken,
            tokenExpirationDate: new Date(),
            image,
            google: {
                id: profile.id,
                data: { ...profile._json }
            }
        };

        DataService.addUser(user);

        LoggerService.logger.debug(
            `New user registered: ${user._id}, ${profile.displayName}, (${profile.provider})`
        );
    } else {
        LoggerService.logger.debug(`User already registered (${user._id})`);
    }

    done(undefined, user);
};

export const GoogleStrategy = new Strategy(strategyOptions, strategy);
