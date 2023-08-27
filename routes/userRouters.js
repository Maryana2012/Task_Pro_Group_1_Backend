import express from 'express';

import userControllers from '../controllers/userControllers.js';
import userValidators from '../middlewars/user/userValidators.js'

const userRouter = express.Router();

userRouter.post('/register', userValidators.isEmptyBody, userValidators.userRegisterValidator, userControllers.register);

userRouter.post('/login', userValidators.isEmptyBody, userValidators.userLoginValidator, userControllers.login);

userRouter.post('/logout', userValidators.authenticate, userControllers.logout);

userRouter.put('/update/:_id', userValidators.isEmptyBody, userValidators.isValidId, userControllers.update);

userRouter.patch('/:_id/theme',userValidators.isEmptyBody, userValidators.isTheme, userControllers.updateTheme)

export default userRouter;