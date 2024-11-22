import express from 'express';
import { signIn, signUp, signOut } from './authController';

const authRoute = express.Router();

authRoute.post('/auth/signup', signUp);
authRoute.post('/auth/signin', signIn);
authRoute.get('/auth/signout', signOut);

export default authRoute;
