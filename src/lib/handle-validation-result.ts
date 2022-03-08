import {validationResult} from 'express-validator';
import createError from 'http-errors';

export default function(req: any) {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    throw new createError.BadRequest(validationErrors.array().join(', '));
  }
};
