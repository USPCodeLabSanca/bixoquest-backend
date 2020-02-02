const express = require('express');
const mongoose = require('mongoose');
const process = require('process');
const cors = require('cors');

const Routes = require('./routes');
const jwt = require('./lib/jwt');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(
  cors({
    exposedHeaders: ['authorization'],
    origin: '*',
  }),
);
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
