import jwt from 'jsonwebtoken';

import userService from '../services/user.service';
import MessageModel from '../models/message';
import formatUser from '../lib/format-user';

interface Token {
  data: any;
}

export default class GameController {
  private app;
  private server: any;

  constructor(app: any) {
    this.app = app;
    this.createServer();
  }

  private async getLoggedUser(token: string) {
    const decoded = (jwt.verify(token.replace('Bearer ', ''), process.env.JWT_PRIVATE_KEY as string) as Token).data;

    const user = formatUser(await userService.getUser(decoded.id), [
      '_id',
      'name',
      'discord',
      'course',
      'character',
    ]);

    return user;
  }

  private async move(socket: any, token: string, lat: number, lng: number) {
    try {
      const user = await this.getLoggedUser(token);

      return socket.broadcast.emit('player-move', {socketId: socket.id, user, lat, lng});
    } catch (error: any) {
      if (error.message) {
        return socket.emit('error-message', error.message);
      }
      return socket.emit('error-message', 'Erro de conexão');
    }
  }

  private async chatMessage(socket: any, token: string, text: string) {
    try {
      const user = await this.getLoggedUser(token);

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

  private createServer() {
    const http = require('http').Server(this.app);
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
        await this.move(socket, token, lat, lng);
      });

      socket.on('chat-message', async (token: string, text: string) => {
        await this.chatMessage(socket, token, text);
      });
    });

    this.server = http;
  }

  public getServer() {
    return this.server;
  }
}
