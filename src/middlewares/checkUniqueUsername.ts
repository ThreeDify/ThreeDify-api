import { ValidationResult } from 'joi';
import Debug, { Debugger } from 'debug';
import { NextFunction, Request, Response } from 'express';

import userService from '../services/users';
import { errorToResponse } from '../utils/joi';
import { ValidationErrorResponse } from '../domain/validations';
import CheckUniqueUsernameValidationSchema from '../validationSchema/CheckUniqueUsernameValidationSchema';

const debug: Debugger = Debug('threedify:middleware:checkUniqueUsername');

interface RequestWithUsername {
  username: string;
}

export async function checkUniqueUsername(
  req: Request<{}, ValidationErrorResponse, RequestWithUsername>,
  res: Response,
  next: NextFunction
) {
  const username: string = req.body.username || (req.query.username as string);

  debug('Validate provided username: %s', username);
  let result: ValidationResult = CheckUniqueUsernameValidationSchema.validate({
    username: username,
  });
  if (result.error) {
    res.json(errorToResponse(result.error));
    return;
  }

  debug('Checking if username "%s" is already used.', result.value.username);
  let user = await userService.fetchUserByUsername(result.value.username);

  if (user) {
    res.json({
      errors: [
        {
          username: {
            message: 'User with this username already exists.',
            value: result.value.username,
          },
        },
      ],
    });

    return;
  }

  next();
}

export default checkUniqueUsername;
