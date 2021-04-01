import Debug, { Debugger } from 'debug';
import { ParamsDictionary, Query } from 'express-serve-static-core';
import { NextFunction, Request, RequestHandler, Response } from 'express';

import config from '../config';
import Image from '../models/Image';
import { upload } from '../utils/uploads';
import imageService from '../services/images';
import { multiple, single } from '../utils/multer';
import { AuthenticatedRequest } from './authenticateUser';
import {
  ValidationErrorItem,
  ValidationErrorResponse,
} from '../domain/validations';

const debug: Debugger = Debug('threedify:middleware:uploadImage');

export interface RequestWithImages<
  P = ParamsDictionary,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = Query
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  images: Image[];
  fileValidationErrors: ValidationErrorItem[];
}

export type AuthRequestWithImages<
  P = ParamsDictionary,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = Query
> = AuthenticatedRequest<P, ResBody, ReqBody, ReqQuery> &
  RequestWithImages<P, ResBody, ReqBody, ReqQuery>;

async function uploadImage(
  file: Express.Multer.File,
  key: string,
  authReq: AuthRequestWithImages
) {
  debug('Uploading image: %s', file.originalname);
  const fileName: string = await upload(file, config.supportedMimeTypes.image);

  authReq.images = authReq.images || [];
  authReq.fileValidationErrors = authReq.fileValidationErrors || [];

  if (fileName) {
    debug('Insert image record.');
    const image: Image = await imageService.insertImage({
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

export function uploadSingleImage(key: string): RequestHandler[] {
  return [
    single(key),
    async (
      req: Request,
      res: Response<ValidationErrorResponse>,
      next: NextFunction
    ) => {
      const authReq: AuthRequestWithImages = req as AuthRequestWithImages;
      try {
        debug('Uploading file for: %s', key);
        const file: Express.Multer.File = req.file;

        if (file) {
          await uploadImage(file, key, authReq);

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
                message: 'Image not uploaded.',
              },
            },
          ],
        });
      } catch (err) {
        debug('%O', err);
        next({
          status: 500,
          message: 'Error occurred while uploading image.',
          err: err,
        });
      }
    },
  ];
}

export function uploadImages(key: string): RequestHandler[] {
  return [
    multiple(key),
    async (
      req: Request,
      res: Response<ValidationErrorResponse>,
      next: NextFunction
    ) => {
      const authReq: AuthRequestWithImages = req as AuthRequestWithImages;
      try {
        debug('Uploading files for: %s', key);
        if (req.files.length > 0) {
          for (const file of req.files as Express.Multer.File[]) {
            await uploadImage(file, key, authReq);
          }

          if (authReq.fileValidationErrors.length === req.files.length) {
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
                message: 'Images not uploaded.',
              },
            },
          ],
        });
      } catch (err) {
        debug('%O', err);
        next({
          status: 500,
          message: 'Error occurred while uploading image.',
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
