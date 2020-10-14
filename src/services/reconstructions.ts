import Debug, { Debugger } from 'debug';

import Image from '../models/Image';
import Reconstruction from '../models/Reconstruction';

const debug: Debugger = Debug('threedify:services:reconstructions');

export async function fetchReconstructionByUserId(
  userId: number
): Promise<Reconstruction[] | undefined> {
  debug('Fetching reconstructions for user: %d.', userId);

  return await Reconstruction.query()
    .where('userId', '=', userId)
    .withGraphFetched('images.uploadedByUser');
}

export async function addImages(
  reconstruction: Reconstruction,
  images: Image[]
): Promise<Reconstruction> {
  await reconstruction.$relatedQuery('images').relate(images);

  return await reconstruction.$fetchGraph('images.uploadedByUser').first();
}

export async function insertReconstruction(
  reconstruction: Partial<Reconstruction>
): Promise<Reconstruction> {
  debug('Creating new reconstruction.');

  return await Reconstruction.query().insertAndFetch(reconstruction);
}

export default {
  addImages,
  insertReconstruction,
  fetchReconstructionByUserId,
};
