const jwt = require('jsonwebtoken');

const userService = require('../services/user.service');
const MessageModel = require('../models/message');
const {formatUser} = require('../lib/format-user');

/**
 * Get user from token
 *
 * @param {string} token
 *
 * @return {object}
 */
async function getLoggedUser(token) {
  const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_PRIVATE_KEY).data;

  const user = formatUser(await userService.getUser(decoded.id), [
    'name',
    'discord',
    'course',
    'character',
  ]);

  return user;
};

/**
 * Move player
 *
 * @param {object} socket
 * @param {string} token
 * @param {number} lat
 * @param {number} lng
 *
 * @return {object}
 */
async function move(socket, token, lat, lng) {
  try {
    const user = await getLoggedUser(token);

    return socket.broadcast.emit('player-move', {socketId: socket.id, user, lat, lng});
  } catch (e) {
    if (e.message) {
      return socket.emit('error-message', e.message);
    }
    return socket.emit('error-message', 'Erro de conexão');
  }
}

/**
 * Chat Message
 *
 * @param {object} socket
 * @param {string} token
 * @param {string} text
 *
 * @return {object}
 */
async function chatMessage(socket, token, text) {
  try {
    const user = await getLoggedUser(token);

    const message = {
      text,
      user: user._id,
    };
    const createdMessage = new MessageModel(message);
    createdMessage.save();

    return socket.broadcast.emit('chat-message', {socketId: socket.id, user, ...createdMessage._doc});
  } catch (e) {
    if (e.message) {
      return socket.emit('error-message', e.message);
    }
    return socket.emit('error-message', 'Erro de conexão');
  }
}

module.exports.httpServer = (app) => {
  const http = require('http').Server(app);
  const io = require('socket.io')(http, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log(`${socket.id} connected`);
    socket.broadcast.emit('join-game', {socketId: socket.id});

    socket.on('disconnect', () => {
      socket.broadcast.emit('leave-game', {socketId: socket.id});
    });

    socket.on('move', async (token, lat, lng) => {
      await move(socket, token, lat, lng);
    });

    socket.on('chat-message', async (token, text) => {
      await chatMessage(socket, token, text);
    });
  });
  return http;
};
