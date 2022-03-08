import createError from 'http-errors';
import jwt from 'jsonwebtoken';

import AdminUserModel from '../models/admin-user';

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

        const adminUser = await AdminUserModel.findById(decoded.id, '-password -createdAt -updatedAt -__v -resetPasswordCode');

        req.adminUser = adminUser;
      }

      next();
    } catch (error) {
      console.log(error);
      return next(new createError.InternalServerError('Erro no servidor.'));
    }
  },
  isAuthenticated: async (req: any, res: any, next: any) => {
    try {
      if (!req.adminUser) {
        return next(new createError.Unauthorized());
      }

      next();
    } catch (error) {
      console.log(error);
      return next(new createError.InternalServerError('Erro no servidor.'));
    }
  }
};
