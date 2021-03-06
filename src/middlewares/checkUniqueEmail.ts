import { ValidationResult } from 'joi';
import Debug, { Debugger } from 'debug';
import { NextFunction, Request, Response } from 'express';
import { ValidationErrorResponse } from '../domain/validations';

import userService from '../services/users';
import { errorToResponse } from '../utils/joi';
import CheckUniqueEmailValidationSchema from '../validationSchema/CheckUniqueEmailValidationSchema';

const debug: Debugger = Debug('threedify:middleware:checkUniqueEmail');

interface RequestWithEmail {
  email: string;
}

export async function checkUniqueEmail(
  req: Request<{}, ValidationErrorResponse, RequestWithEmail>,
  res: Response,
  next: NextFunction
) {
  const email: string = req.body.email || (req.query.email as string);

  debug('Validate provided email: %s', email);
  let result: ValidationResult = CheckUniqueEmailValidationSchema.validate({
    email: email,
  });
  if (result.error) {
    res.status(422);
    res.json(errorToResponse(result.error));
    return;
  }

  try {
    debug('Checking if email "%s" is already used.', result.value.email);
    let user = await userService.fetchUserByEmail(result.value.email);

    if (user) {
      res.status(409);
      res.json({
        errors: [
          {
            email: {
              message: 'This email is already registered to another user.',
              value: result.value.email,
            },
          },
        ],
      });

      return;
    }

    next();
  } catch (err) {
    debug('ERROR: %O', err);

    next({
      status: 500,
      message: 'Error occurred while validating email.',
      ...err,
    });
  }
}

export default checkUniqueEmail;
