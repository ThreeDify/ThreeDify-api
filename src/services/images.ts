import Debug, { Debugger } from 'debug';

import knex from '../utils/knex';
import { Image } from '../domain/images';

const debug: Debugger = Debug('threedify:services:images');

export async function fetchImageByFileName(
  fileName: string
): Promise<Image | undefined> {
  debug('Fetching image with name: %s.', fileName);

  return await knex()
    .select('*')
    .from<Image>('images')
    .where('file_name', '=', fileName)
    .first();
}

export default {
  fetchImageByFileName,
};
