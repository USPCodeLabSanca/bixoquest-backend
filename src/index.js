const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const OAuth1Strategy = require('passport-oauth1');
const OAuth = require('oauth');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');

const Routes = require('./routes');
const AuthController = require('./controllers/auth');
const jwt = require('./lib/jwt');

const app = express();
const port = process.env.PORT || 8080;

require('dotenv').config();

const { env } = process;

app.use(express.static(path.join(__dirname, '../../bixoquest/build')));

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
app.use(
  cors({
    origin: [env.FRONTEND_URL, env.BACKOFFICE_URL],
    exposedHeaders: ['authorization'],
    credentials: true,
  }),
);

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

      AuthController.authenticateUser(data, done);
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
  successRedirect: env.FRONTEND_URL,
  failureRedirect: '/api/auth/failure',
}));


/* This middleware function handles tokens. If a token is passed, it verifies if
it's valid. If the token is valid, it populates `req.auth` with it's payload, and
already creates a refresh token to ben sent. */
app.use((req, res, next) => {
  const token = req.headers.authorization; // extract token
  if (!token) return next();
  const payload = jwt.verify(token); // extract payload
  if (!payload) return next();
  req.auth = payload; // populate `req.auth` with the payload
  res.setHeader('authorization', jwt.create({ id: payload.id, isAdmin: payload.isAdmin })); // refresh token
  return next();
});

app.use('/api', Routes);

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'client/build/index.html')));

let backendUrl = `mongodb+srv://${env.MONGO_ATLAS_USER}:${env.MONGO_ATLAS_PASSWORD}@${env.MONGO_ATLAS_URL}/${env.MONGO_ATLAS_DB}?retryWrites=true&w=majority`;
if (env.NODE_ENV === 'production') {
  backendUrl = `mongodb://${env.MONGO_LOCAL_USER}:${env.MONGO_LOCAL_PASSWORD}@${env.MONGO_LOCAL_URL}/${env.MONGO_LOCAL_DB}`;
}

mongoose.connect(backendUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('error', (e) => {
  console.error('Error connecting to MongoDB!');
  console.error(e);
});

mongoose.connection.on('open', () => {
  console.log('Connected successfuly to MongoDB!');
  app.listen(port, () => {
    console.log(`Now listening at port ${port} for requests!`);
  });
});
