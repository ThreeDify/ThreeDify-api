import { ValidationResult } from 'joi';
import Debug, { Debugger } from 'debug';
import { NextFunction, Request, Response } from 'express';

import { cleanUp } from '../utils/uploads';
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
    res.json(errorToResponse(result.error));

    debug('Cleaning up temp files.');
    for (let file of req.files as Express.Multer.File[]) {
      await cleanUp(file.path);
    }

    return;
  }

  req.body = result.value;

  next();
}

export default validateNewReconstruction;
