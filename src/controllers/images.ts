import { resolve } from 'path';
import { existsSync } from 'fs';
import Debug, { Debugger } from 'debug';
import { Request, NextFunction, Response } from 'express';

import config from '../config';
import { Image } from '../domain/images';
import imageService from '../services/images';

const debug: Debugger = Debug('threedify:controller:images');

export async function image(req: Request, res: Response, next: NextFunction) {
  const fileName: string = req.params.file_name;

  debug('Check if image record exists.');
  if (fileName) {
    const image: Image | undefined = await imageService.fetchImageByFileName(
      fileName
    );
    const filePath = resolve(config.uploadDirectory, fileName);

    debug('Check if image file exists.');
    if (image?.id && existsSync(filePath)) {
      res.sendFile(filePath);
      return;
    }
  }

  res.sendStatus(404);
}

export default {
  image,
};
