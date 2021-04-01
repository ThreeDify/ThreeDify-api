import { ValidationResult } from 'joi';
import Debug, { Debugger } from 'debug';
import { NextFunction, Request, Response } from 'express';

import { errorToResponse } from '../utils/joi';
import NewReconstruction from '../domain/NewReconstruction';
import { ValidationErrorResponse } from '../domain/validations';
import NewReconstructionValidationSchema from '../validationSchema/NewReconstructionValidationSchema';

const debug: Debugger = Debug('threedify:middleware:validateNewReconstruction');

export async function validateNewReconstruction(
  req: Request<{}, ValidationErrorResponse, NewReconstruction>,
  res: Response,
  next: NextFunction
) {
  debug('Validating data for new reconstruction.');

  const result: ValidationResult = NewReconstructionValidationSchema.validate(
    req.body,
    {
      abortEarly: false,
    }
  );

  if (result.error) {
    res.status(422);
    res.json(errorToResponse(result.error));

    return;
  }

  req.body = result.value;

  next();
}

export default validateNewReconstruction;
