import passport from 'passport';

import { GoogleStrategy } from './strategies/google';
import { GithubStrategy } from './strategies/github';
import { LinkedInStrategy } from './strategies/linkedin';
import { LocalStrategy } from './strategies/local';

import { VerifyCallback } from 'passport-google-oauth20';

import { User } from '@ffknob/elastic-apm-demo-shared';

import { DataService } from '../services';

export const init = () => {
    passport.serializeUser<any, any>((user: User, done: VerifyCallback) => {
        console.log(user);
        done(undefined, user._id);
    });

    passport.deserializeUser((id: string, done: VerifyCallback) => {
        const user: User | undefined = DataService.findUserById(id);

        if (user) {
            done(undefined, user);
        } else {
            done(new Error(`User with id ${id} not found.`), null);
        }
    });

    passport.use(GoogleStrategy);
    passport.use(GithubStrategy);
    passport.use(LinkedInStrategy);
    passport.use(LocalStrategy);
};
