const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const OAuth1Strategy = require('passport-oauth1');
const OAuth = require('oauth');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const {httpServer} = require('./controllers/game.controller');
const AuthController = require('./controllers/auth.controller');
const Routes = require('./routes');

const {env} = process;

const app = express();
const port = env.PORT || 8080;

const http = httpServer(app);

app.use(express.static(path.join(__dirname, env.FRONTEND_PATH)));

// cookieSession config
app.use(cookieSession({
  name: 'session',
  keys: [env.SESSION_KEY],
  maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
}));

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cors({
  origin: [env.FRONTEND_URL, env.FRONTEND_LOCAL_URL, env.BACKOFFICE_URL, env.BACKOFFICE_LOCAL_URL],
  exposedHeaders: ['authorization', 'X-Forwarded-For', 'Host', 'Upgrade', 'Connection'],
  credentials: true,
}));

passport.use('provider', new OAuth1Strategy({
  requestTokenURL: env.OAUTH_REQUEST_TOKEN_URL,
  accessTokenURL: env.OAUTH_ACCESS_TOKEN_URL,
  userAuthorizationURL: env.OAUTH_USER_AUTHORIZATION_URL,
  consumerKey: env.OAUTH_CONSUMER_KEY,
  consumerSecret: env.OAUTH_CONSUMER_SECRET,
  callbackURL: '/api/auth/redirect',
}, (token, tokenSecret, profile, done) => {
  const oauth = new OAuth.OAuth(
      env.OAUTH_REQUEST_TOKEN_URL,
      env.OAUTH_ACCESS_TOKEN_URL,
      env.OAUTH_CONSUMER_KEY,
      env.OAUTH_CONSUMER_SECRET,
      '1.0',
      null,
      'HMAC-SHA1',
  );

  oauth.post(
      env.OAUTH_USER_RESOURCE_URL,
      token,
      tokenSecret,
      null,
      null,
      async (err, data) => {
        if (err) {
          console.error(err);
        }

        await AuthController.authenticateUser(data, done);
      },
  );
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get('/api/auth/', passport.authenticate('provider'));

app.get('/api/auth/redirect', passport.authenticate('provider', {
  successRedirect: `${env.FRONTEND_URL}/auth-usp`,
  failureRedirect: '/api/auth/failure',
}));

app.use('/api', Routes);

app.use((error, req, res, next) => {
  return res.status(error.status).json({message: error.message});
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, env.FRONTEND_PATH, 'index.html')));

const backendUrl = `mongodb+srv://${env.MONGO_ATLAS_USER}:${env.MONGO_ATLAS_PASSWORD}@${env.MONGO_ATLAS_URL}/${env.MONGO_ATLAS_DB}?retryWrites=true&w=majority`;

mongoose.connect(backendUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

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
