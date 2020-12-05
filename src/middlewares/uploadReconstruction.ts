import Debug, { Debugger } from 'debug';
import { NextFunction, Request, Response } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';

import config from '../config';
import { single } from '../utils/multer';
import { upload } from '../utils/uploads';
import { AuthenticatedRequest } from './authenticate';
import {
  ValidationErrorItem,
  ValidationErrorResponse,
} from '../domain/validations';

const debug: Debugger = Debug('threedify:middleware:uploadImage');

export interface RequestWithReconstructionFile<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  reconstructionFileName: string;
  fileValidationErrors: ValidationErrorItem[];
}

export type AuthRequestWithReconstructionFile<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query
> = AuthenticatedRequest<P, ResBody, ReqBody, ReqQuery> &
  RequestWithReconstructionFile<P, ResBody, ReqBody, ReqQuery>;

async function uploadFile(
  file: Express.Multer.File,
  key: string,
  authReq: AuthRequestWithReconstructionFile
) {
  debug('Uploading reconstruction: %s, %s', file.originalname, file.mimetype);
  const fileName: string = await upload(
    file,
    config.supportedMimeTypes.reconstruction
  );

  authReq.fileValidationErrors = authReq.fileValidationErrors || [];

  if (fileName) {
    authReq.reconstructionFileName = fileName;
  } else {
    debug('File validation failed.');
    authReq.fileValidationErrors.push({
      [key]: {
        value: { filename: file.originalname, mimetype: file.mimetype },
        message: "Uploaded file isn't a valid reconstruction file.",
      },
    });
  }
}

export function uploadReconstruction(key: string) {
  return [
    single(key),
    async (
      req: Request,
      res: Response<ValidationErrorResponse>,
      next: NextFunction
    ) => {
      const authReq: AuthRequestWithReconstructionFile = req as AuthRequestWithReconstructionFile;
      try {
        debug('Uploading file for: %s', key);
        const file: Express.Multer.File = req.file;

        if (file) {
          await uploadFile(file, key, authReq);

          if (authReq.fileValidationErrors.length === 1) {
            res.status(422);
            res.json({
              errors: authReq.fileValidationErrors,
            });
            return;
          }

          next();
          return;
        }

        res.status(422);
        res.json({
          errors: [
            {
              [key]: {
                message: 'Reconstruction file not uploaded.',
              },
            },
          ],
        });
      } catch (err) {
        debug('%O', err);
        next({
          status: 500,
          message: 'Error occurred while uploading reconstruction file.',
          err: err,
        });
      }
    },
  ];
}

export default {
  uploadReconstruction,
};
