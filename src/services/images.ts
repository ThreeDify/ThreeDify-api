import Debug, { Debugger } from 'debug';

import { Image } from '../models/Image';

const debug: Debugger = Debug('threedify:services:images');

export async function fetchImageById(id: number): Promise<Image | undefined> {
  debug('Fetching image with name: %s.', id);

  return await Image.query()
    .where('id', '=', id)
    .withGraphFetched('uploadedByUser(defaultSelect)')
    .first();
}

export async function fetchImageByFileName(
  fileName: string
): Promise<Image | undefined> {
  debug('Fetching image with name: %s.', fileName);

  return await Image.query()
    .where('fileName', '=', fileName)
    .withGraphFetched('uploadedByUser(defaultSelect)')
    .first();
}

export async function insertImage(image: Partial<Image>): Promise<Image> {
  debug('Inserting image with name: %s.', image.fileName);

  return await Image.query()
    .insertAndFetch(image)
    .withGraphFetched('uploadedByUser(defaultSelect)');
}

export default {
  insertImage,
  fetchImageByFileName,
};
