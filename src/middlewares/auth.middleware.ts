import createError from 'http-errors';
import jwt from 'jsonwebtoken';

import UserModel from '../models/user';

interface Token {
  data: any;
}

export default {
  authenticate: async (req: any, res: any, next: any) => {
    try {
      let token = req.header('Authorization');
      if (token) {
        token = token.replace('Bearer ', '');
        const decoded = (jwt.verify(token, process.env.JWT_PRIVATE_KEY as string) as Token).data;

        const user = await UserModel.findById(decoded.id);

        req.user = user;
      }

      next();
    } catch (error) {
      console.log(error);
      return next(new createError.InternalServerError('Erro no servidor.'));
    }
  },
  isAuthenticated: async (req: any, res: any, next: any) => {
    try {
      if (!req.user) {
        return next(new createError.Unauthorized());
      }

      next();
    } catch (error) {
      console.log(error);
      return next(new createError.InternalServerError('Erro no servidor.'));
    }
  },
};
