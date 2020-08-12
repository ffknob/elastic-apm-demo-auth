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
            successRedirect: '/simulate',
            failureRedirect: '/signin'
        })(req, res, next);
    }
);

export default router;
