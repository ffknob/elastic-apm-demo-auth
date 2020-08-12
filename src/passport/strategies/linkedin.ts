import passport from 'passport';

import {
    Strategy,
    StrategyOptions,
    VerifyCallback,
    Profile
} from 'passport-linkedin-oauth2';

import {
    User,
    SignInProvider,
    LoggerService
} from '@ffknob/elastic-apm-demo-shared';

import { DataService } from '../../services';

const provider: SignInProvider = 'linkedin';

const strategyOptions: StrategyOptions = {
    clientID: process.env.LINKEDIN_CLIENT_ID || '',
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
    callbackURL: process.env.LINKEDIN_CALLBACK_URL || ''
};

const strategy = (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
) => {
    LoggerService.logger.debug(`User profile id ${profile.id} at ${provider}`);

    let user: User | undefined = DataService.findProviderUser(
        profile.id,
        provider
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

        DataService.addUser(user);
    }

    done(undefined, user);
};

export const LinkedInStrategy = new Strategy(strategyOptions, strategy);
