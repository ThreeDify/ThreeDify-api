import Debug, { Debugger } from 'debug';

import { Image } from '../models/Image';

const debug: Debugger = Debug('threedify:services:images');

export async function fetchImageByFileName(
  fileName: string
): Promise<Image | undefined> {
  debug('Fetching image with name: %s.', fileName);

  return await Image.query().where('fileName', '=', fileName).first();
}

export default {
  fetchImageByFileName,
};
