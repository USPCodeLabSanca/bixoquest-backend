const express = require('express');
const mongoose = require('mongoose');
const process = require('process');
const cors = require('cors');
const passport = require('passport');
const OAuth1Strategy = require('passport-oauth1');
const cookieSession = require('cookie-session');
const OAuth = require('oauth');
const cookieParser = require('cookie-parser');
const ObjectId = require('mongodb').ObjectID;

const UserModel = require('./models/user');
const Routes = require('./routes');
const jwt = require('./lib/jwt');

const app = express();
const port = process.env.PORT || 8080;

require('dotenv').config();

// cookieSession config
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_KEY],
  maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
}));

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    exposedHeaders: ['authorization'],
    credentials: true,
  }),
);

passport.use('provider', new OAuth1Strategy({
  requestTokenURL: process.env.OAUTH_REQUEST_TOKEN_URL,
  accessTokenURL: process.env.OAUTH_ACCESS_TOKEN_URL,
  userAuthorizationURL: process.env.OAUTH_USER_AUTHORIZATION_URL,
  consumerKey: process.env.OAUTH_CONSUMER_KEY,
  consumerSecret: process.env.OAUTH_CONSUMER_SECRET,
  callbackURL: '/auth/redirect',
}, (token, tokenSecret, profile, done) => {
  const oauth = new OAuth.OAuth(
    process.env.OAUTH_REQUEST_TOKEN_URL,
    process.env.OAUTH_ACCESS_TOKEN_URL,
    process.env.OAUTH_CONSUMER_KEY,
    process.env.OAUTH_CONSUMER_SECRET,
    '1.0',
    null,
    'HMAC-SHA1',
  );

  oauth.post(
    process.env.OAUTH_USER_RESOURCE_URL,
    token,
    tokenSecret,
    null,
    null,
    async (err, data) => {
      if (err) {
        console.error(err);
      }

      const user = JSON.parse(data).loginUsuario;
      const currentUser = await UserModel.findOne({ nusp: user.loginUsuario });

      if (!currentUser) {
        const newUser = new UserModel();

        newUser._id = new ObjectId();
        newUser.nusp = user.loginUsuario;
        newUser.name = user.nomeUsuario;
        newUser.isAdmin = false;
        newUser.course = user.siglaUnidade;
        newUser.completed_missions = [];
        newUser.available_packs = 0;
        newUser.opened_packs = 0;
        newUser.stickers = [];
        newUser.lastTrade = null;

        await newUser.save();

        delete newUser.isAdmin;
        delete newUser.lastTrade;

        if (newUser) {
          done(null, newUser);
        }
      }

      delete currentUser.isAdmin;
      delete currentUser.lastTrade;

      done(null, currentUser);
    },
  );
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get('/auth/success', (req, res) => {
  const authorization = jwt.create({ id: req.user._id });

  if (req.user) {
    res.json({
      success: true,
      message: 'Usuário autenticado com sucesso.',
      user: req.user,
      token: authorization,
      cookies: req.cookies,
    });
  }
});

app.get('/auth/failed', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'Falha ao autenticar usuário.',
  });
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect(process.env.FRONTEND_URL);
});

app.get('/auth', passport.authenticate('provider'));

app.get('/auth/redirect', passport.authenticate('provider', {
  successRedirect: process.env.FRONTEND_URL,
  failureRedirect: '/auth/login/failed',
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
  res.setHeader('authorization', jwt.create({ id: payload.id })); // refresh token
  return next();
});
app.use(Routes);

app.get('/', (req, res) => res.send('Bem-Vind@ a API do BixoQuest'));

// Local Url
// const backendUrl = "mongodb://localhost:27017/BixoQuest";

// Docker Url
// const backendUrl = "mongodb://mongo:27017/BixoQuest";

// MongoAtlas Url
const backendUrl = 'mongodb+srv://admin:1234567890@cluster0-xcndn.mongodb.net/BixoQuest?retryWrites=true&w=majority';

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
