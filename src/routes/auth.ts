import express, { Request, Response, NextFunction } from 'express';

import passport from 'passport';

const router = express.Router();

//router.post('/signin', );

//router.post('/signout', )

router.post('/:provider', (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(req.params.provider, {
        scope: ['profile', 'email']
    })(req, res, next);
});

router.get(
    '/:provider/redirect',
    (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate(req.params.provider, {
            successRedirect: process.env.SIGIN_SUCCESS_REDIRECT_URL,
            failureRedirect: process.env.SIGIN_FAILURE_REDIRECT_URL
        })(req, res, next);
    }
);

export default router;
