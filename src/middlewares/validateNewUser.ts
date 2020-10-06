import { ValidationResult } from 'joi';
import Debug, { Debugger } from 'debug';
import { NextFunction, Request, Response } from 'express';

import { NewUser } from '../domain/users';
import { errorToResponse } from '../utils/joi';
import { ValidationErrorResponse } from '../domain/validations';
import NewUserValidationSchema from '../validationSchema/NewUserValidationSchema';

const debug: Debugger = Debug('threedify:middleware:validateNewUser');

export async function validateNewUser(
  req: Request<{}, ValidationErrorResponse, NewUser>,
  res: Response,
  next: NextFunction
) {
  debug('Validating data for new user.');

  const result: ValidationResult = NewUserValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (result.error) {
    res.json(errorToResponse(result.error));
    return;
  }

  req.body = result.value;

  next();
}

export default validateNewUser;
