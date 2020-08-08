import passport from 'passport';

import { GoogleStrategy } from './strategies/google';
import { LocalStrategy } from './strategies/local';

import { VerifyCallback } from 'passport-google-oauth20';
import { User } from '@ffknob/elastic-apm-demo-shared';

export const users: User[] = [];

export const init = () => {
    passport.serializeUser<any, any>((user: User, done: VerifyCallback) => {
        done(undefined, user._id);
    });

    passport.deserializeUser((id: string, done: VerifyCallback) => {
        const user: User | undefined = users.find((u: User) => u._id === id);

        if (user) {
            done(undefined, user);
        } else {
            done('XXXXXXXXXXXXXX', null);
        }
    });

    passport.use(LocalStrategy);
    passport.use(GoogleStrategy);
};
