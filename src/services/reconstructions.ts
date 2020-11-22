import Debug, { Debugger } from 'debug';

import Image from '../models/Image';
import Reconstruction from '../models/Reconstruction';
import { applyPagination } from '../utils/pagination';
import PaginationQuery from '../domain/PaginationQuery';
import PaginatedResult from '../domain/PaginatedResult';

const debug: Debugger = Debug('threedify:services:reconstructions');

export async function fetchAllReconstructions(
  query: PaginationQuery
): Promise<PaginatedResult<Reconstruction> | undefined> {
  debug('Fetching all reconstructions.');

  return await applyPagination(
    Reconstruction.query().withGraphFetched(
      '[createdByUser(defaultSelect), images.uploadedByUser(defaultSelect)]'
    ),
    query
  );
}

export async function fetchReconstructionById(
  id: number
): Promise<Reconstruction | undefined> {
  debug('Fetching reconstruction with id: %d.', id);

  return await Reconstruction.query()
    .where('id', '=', id)
    .withGraphFetched(
      '[createdByUser(defaultSelect), images.uploadedByUser(defaultSelect)]'
    )
    .first();
}

export async function fetchReconstructionByUserId(
  userId: number,
  query: PaginationQuery
): Promise<PaginatedResult<Reconstruction> | undefined> {
  debug('Fetching reconstructions for user: %d.', userId);

  return await applyPagination(
    Reconstruction.query()
      .where('createdBy', '=', userId)
      .withGraphFetched(
        '[createdByUser(defaultSelect), images.uploadedByUser(defaultSelect)]'
      ),
    query
  );
}

export async function addImages(
  reconstruction: Reconstruction,
  images: Image[]
): Promise<Reconstruction> {
  await reconstruction.$relatedQuery('images').relate(images);

  return await reconstruction
    .$fetchGraph(
      '[createdByUser(defaultSelect), images.uploadedByUser(defaultSelect)]'
    )
    .first();
}

export async function insertReconstruction(
  reconstruction: Partial<Reconstruction>
): Promise<Reconstruction> {
  debug('Creating new reconstruction.');

  return await Reconstruction.query()
    .insertAndFetch(reconstruction)
    .withGraphFetched(
      '[createdByUser(defaultSelect), images.uploadedByUser(defaultSelect)]'
    );
}

export default {
  addImages,
  insertReconstruction,
  fetchAllReconstructions,
  fetchReconstructionById,
  fetchReconstructionByUserId,
};
