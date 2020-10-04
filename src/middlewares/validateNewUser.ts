import Debug, { Debugger } from 'debug';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { NewUser } from '../domain/users';
import userService from '../services/users';
import NewUserValidationSchema from '../validationSchema/NewUserValidationSchema';

const debug: Debugger = Debug('threedify:middleware:validateNewUser');

async function checkUniqueUsername(username: string) {
  let user = await userService.fetchUserByUsername(username);

  if (user) {
    throw {
      username: {
        message: 'User with this username already exists.',
        value: username,
      },
    };
  }
}

async function checkUniqueEmail(email: string) {
  let user = await userService.fetchUserByEmail(email);

  if (user) {
    throw {
      email: {
        message: 'This email is already registered to another user.',
        value: email,
      },
    };
  }
}

export async function validateNewUser(
  req: Request<{}, any, NewUser>,
  res: Response,
  next: NextFunction
) {
  try {
    const result: Joi.ValidationResult = NewUserValidationSchema.validate(
      req.body,
      {
        abortEarly: false,
      }
    );

    if (result.error) {
      res.json({
        errors: result.error.details.map((value) => {
          return {
            [value.context?.key || '']: {
              message: value.message,
              value: value.context?.value,
            },
          };
        }),
      });
      return;
    }

    req.body = result.value;

    await checkUniqueEmail(req.body.email);
    await checkUniqueUsername(req.body.username);

    next();
  } catch (err) {
    res.json({
      errors: err,
    });
  }
}

export default {
  validateNewUser,
};
