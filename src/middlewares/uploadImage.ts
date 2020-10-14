import Debug, { Debugger } from 'debug';
import { NextFunction, Request, Response } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';

import Image from '../models/Image';
import { upload } from '../utils/uploads';
import imageService from '../services/images';
import { multiple, single } from '../utils/multer';
import { AuthenticatedRequest } from './authenticate';
import {
  ValidationErrorItem,
  ValidationErrorResponse,
} from '../domain/validations';

const debug: Debugger = Debug('threedify:services:uploadImage');

export interface RequestWithFiles<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  images: Image[];
  fileValidationErrors: ValidationErrorItem[];
}

export type AuthRequestWithFiles<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query
> = AuthenticatedRequest<P, ResBody, ReqBody, ReqQuery> &
  RequestWithFiles<P, ResBody, ReqBody, ReqQuery>;

async function uploadImage(
  file: Express.Multer.File,
  key: string,
  authReq: AuthRequestWithFiles
) {
  debug('Uploading file: %s', file.originalname);
  const fileName: string | undefined = upload(file);

  authReq.images = authReq.images || [];
  authReq.fileValidationErrors = authReq.fileValidationErrors || [];

  if (fileName) {
    debug('Insert image record.');
    let image: Image = await imageService.insertImage({
      fileName: fileName,
      mimetype: file.mimetype,
      uploadedBy: authReq.user.id,
    });

    authReq.images.push(image);
  } else {
    debug('File validation failed.');
    authReq.fileValidationErrors.push({
      [key]: {
        value: { filename: file.originalname, mimetype: file.mimetype },
        message:
          "Uploaded file isn't a valid image. Only jpeg and png are supported.",
      },
    });
  }
}

export function uploadSingleImage(key: string) {
  return [
    single(key),
    async (
      req: Request,
      res: Response<ValidationErrorResponse>,
      next: NextFunction
    ) => {
      const authReq: AuthRequestWithFiles = req as AuthRequestWithFiles;
      try {
        debug('Uploading file for: %s', key);
        const file: Express.Multer.File = req.file;

        if (file) {
          await uploadImage(file, key, authReq);

          if (authReq.fileValidationErrors.length === 1) {
            res.json({
              errors: authReq.fileValidationErrors,
            });
            return;
          }

          next();
          return;
        }

        res.json({
          errors: [
            {
              [key]: {
                message: 'Image file not uploaded.',
              },
            },
          ],
        });
      } catch (err) {
        debug('%O', err);
        next({
          status: 500,
          message: 'Error occurred while uploading file.',
          err: err,
        });
      }
    },
  ];
}

export function uploadImages(key: string) {
  return [
    multiple(key),
    async (
      req: Request,
      res: Response<ValidationErrorResponse>,
      next: NextFunction
    ) => {
      const authReq: AuthRequestWithFiles = req as AuthRequestWithFiles;
      try {
        debug('Uploading files for: %s', key);
        if (req.files.length > 0) {
          for (let file of req.files as Express.Multer.File[]) {
            await uploadImage(file, key, authReq);
          }

          if (authReq.fileValidationErrors.length === req.files.length) {
            res.json({
              errors: authReq.fileValidationErrors,
            });
            return;
          }
          next();
          return;
        }

        res.json({
          errors: [
            {
              [key]: {
                message: 'Image files not uploaded.',
              },
            },
          ],
        });
      } catch (err) {
        debug('%O', err);
        next({
          status: 500,
          message: 'Error occurred while uploading file.',
          err: err,
        });
      }
    },
  ];
}

export default {
  uploadImages,
  uploadSingleImage,
};
