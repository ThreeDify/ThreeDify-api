import { ValidationResult } from 'joi';
import Debug, { Debugger } from 'debug';
import { NextFunction, Request, Response } from 'express';

import LoginCredential from '../domain/login';
import { errorToResponse } from '../utils/joi';
import { ValidationErrorResponse } from '../domain/validations';
import LoginCredentialValidationSchema from '../validationSchema/LoginCredentialValidationSchema';

const debug: Debugger = Debug('threedify:middleware:validateLoginCredential');

export async function validateLoginCredential(
  req: Request<{}, ValidationErrorResponse, LoginCredential>,
  res: Response,
  next: NextFunction
) {
  debug('Validating login credential.');

  const result: ValidationResult = LoginCredentialValidationSchema.validate(
    req.body,
    {
      abortEarly: false,
    }
  );

  if (result.error) {
    res.status(401);
    res.json(errorToResponse(result.error));
    return;
  }

  req.body = result.value;

  next();
}

export default validateLoginCredential;
