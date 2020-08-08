import express, { Request, Response, NextFunction } from 'express';

import passport from 'passport';

const router = express.Router();

//router.post('/signin', );

//router.post('/signout', )

router.post('/google', passport.authenticate('google', { scope: ['profile'] }));

router.post(
    '/:provider/redirect',
    (req: Request, res: Response, next: NextFunction) =>
        passport.authenticate(req.params.provider),
    (req: Request, res: Response, next: NextFunction) => {
        res.redirect('/profile');
    }
);

export default router;
