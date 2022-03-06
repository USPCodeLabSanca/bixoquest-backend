import jwt from 'jsonwebtoken';

import userService from '../services/user.service';
import MessageModel from '../models/message';
import formatUser from '../lib/format-user';

interface Token {
  data: any;
}

/**
 * Get user from token
 */
async function getLoggedUser(token: string) {
  const decoded = (jwt.verify(token.replace('Bearer ', ''), process.env.JWT_PRIVATE_KEY as string) as Token).data;

  const user = formatUser(await userService.getUser(decoded.id), [
    '_id',
    'name',
    'discord',
    'course',
    'character',
  ]);

  return user;
};

/**
 * Move player
 */
async function move(socket: any, token: string, lat: number, lng: number) {
  try {
    const user = await getLoggedUser(token);

    return socket.broadcast.emit('player-move', {socketId: socket.id, user, lat, lng});
  } catch (error: any) {
    if (error.message) {
      return socket.emit('error-message', error.message);
    }
    return socket.emit('error-message', 'Erro de conexão');
  }
}

/**
 * Chat Message
 */
async function chatMessage(socket: any, token: string, text: string) {
  try {
    const user = await getLoggedUser(token);

    const message = {
      text,
      user: user._id,
    };
    const createdMessage = new MessageModel(message);
    await createdMessage.save();

    return socket.broadcast.emit('chat-message', {socketId: socket.id, user, message: createdMessage._doc});
  } catch (error: any) {
    if (error.message) {
      return socket.emit('error-message', error.message);
    }
    return socket.emit('error-message', 'Erro de conexão');
  }
}

export default (app: any) => {
  const http = require('http').Server(app);
  const io = require('socket.io')(http, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket: any) => {
    console.log(`${socket.id} connected`);
    socket.broadcast.emit('join-game', {socketId: socket.id});

    socket.on('disconnect', () => {
      socket.broadcast.emit('leave-game', {socketId: socket.id});
    });

    socket.on('move', async (token: string, lat: number, lng: number) => {
      await move(socket, token, lat, lng);
    });

    socket.on('chat-message', async (token: string, text: string) => {
      await chatMessage(socket, token, text);
    });
  });
  return http;
};
