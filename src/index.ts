import path from 'path';

import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import * as rfs from 'rotating-file-stream';
import cors from 'cors';
import passport from 'passport';
const OAuth1Strategy = require('passport-oauth1');
import OAuth from 'oauth';
import session from 'express-session';
import cookieParser from 'cookie-parser';
require('dotenv').config();

import httpServer from './controllers/game.controller';
import AuthController from './controllers/auth.controller';
import Routes from './routes';

const {env} = process;

const app = express();
const port = env.PORT || 8080;

const http = httpServer(app);

app.use(cors({
  origin: [
    env.FRONTEND_URL as string,
    env.FRONTEND_LOCAL_URL as string,
    env.BACKOFFICE_URL as string,
    env.BACKOFFICE_LOCAL_URL as string
  ],
  exposedHeaders: ['authorization', 'X-Forwarded-For', 'Host', 'Upgrade', 'Connection'],
  credentials: true,
}));

// create a rotating write stream
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, '..', 'logs'),
});
app.use(morgan('combined', {stream: accessLogStream}));

app.use(express.static(path.join(__dirname, env.FRONTEND_PATH as string)));

app.use(cookieParser());
app.use(express.json());
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: env.SESSION_KEY as string,
  cookie: {maxAge: 1 * 60 * 1000}, // One minute in milliseconds
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use('provider', new OAuth1Strategy({
  requestTokenURL: env.OAUTH_REQUEST_TOKEN_URL,
  accessTokenURL: env.OAUTH_ACCESS_TOKEN_URL,
  userAuthorizationURL: env.OAUTH_USER_AUTHORIZATION_URL,
  consumerKey: env.OAUTH_CONSUMER_KEY,
  consumerSecret: env.OAUTH_CONSUMER_SECRET,
  callbackURL: '/api/auth/redirect',
}, (token: string, tokenSecret: string, profile: any, done: Function) => {
  const oauth = new OAuth.OAuth(
      env.OAUTH_REQUEST_TOKEN_URL as string,
      env.OAUTH_ACCESS_TOKEN_URL as string,
      env.OAUTH_CONSUMER_KEY as string,
      env.OAUTH_CONSUMER_SECRET as string,
      '1.0',
      null,
      'HMAC-SHA1',
  );

  oauth.post(
      env.OAUTH_USER_RESOURCE_URL as string,
      token,
      tokenSecret,
      null,
      undefined,
      async (err: any, data: any) => {
        if (err) {
          console.error(err);
        }

        await AuthController.authenticateUser(data, done);
      },
  );
}));

passport.serializeUser((user: any, done: Function) => {
  done(null, user);
});

passport.deserializeUser((user: any, done: Function) => {
  done(null, user);
});

app.get('/api/auth/', passport.authenticate('provider'));

app.get('/api/auth/redirect', passport.authenticate('provider', {
  successRedirect: `${env.FRONTEND_URL}/auth`,
  failureRedirect: '/api/auth/failure',
}));

app.use('/api', Routes);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  return res.status(error.status).json({message: error.message});
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, env.FRONTEND_PATH as string, 'index.html')));

const backendUrl = `mongodb+srv://${env.MONGO_ATLAS_USER}:${env.MONGO_ATLAS_PASSWORD}@${env.MONGO_ATLAS_URL}/${env.MONGO_ATLAS_DB}?retryWrites=true&w=majority`;

mongoose.connect(backendUrl);

mongoose.connection.on('error', (e) => {
  console.error('Error connecting to MongoDB!');
  console.error(e);
});

mongoose.connection.on('open', () => {
  console.log('Connected successfuly to MongoDB!');
  http.listen(port, () => {
    console.log(`Now listening at port ${port} for requests!`);
  });
});
