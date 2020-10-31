import { Readable } from 'stream';
import Debug, { Debugger } from 'debug';
import { Request, NextFunction, Response } from 'express';

import Image from '../models/Image';
import imageService from '../services/images';
import StorageAPI from '../domain/StorageAPI';
import { getStorageAPI } from '../utils/storage';
import { getUploadDirectory } from '../utils/uploads';

const debug: Debugger = Debug('threedify:controller:images');

export async function image(req: Request, res: Response, next: NextFunction) {
  const fileName: string = req.params.file_name;

  try {
    debug('Check if image record exists.');
    if (fileName) {
      const image: Image | undefined = await imageService.fetchImageByFileName(
        fileName
      );

      const storageAPI: StorageAPI = getStorageAPI();
      const filePath: string = await storageAPI.getFilePath(
        getUploadDirectory(),
        fileName
      );

      debug('Check if image file exists.');
      if (image?.id && (await storageAPI.fileExists(filePath))) {
        let stream: Readable = await storageAPI.openReadStream(filePath);

        res.setHeader('Content-Type', image.mimetype);
        stream.pipe(res);

        return;
      }
    }

    next({
      status: 404,
      message: 'Image not found.',
    });
  } catch (err) {
    debug('ERROR: %O', err);

    next({
      status: 500,
      message: 'Error occurred while fetching image.',
      ...err,
    });
  }
}

export default {
  image,
};
