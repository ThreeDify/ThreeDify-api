import Objection from 'objection';
import Debug, { Debugger } from 'debug';

import Image from '../models/Image';
import Reconstruction from '../models/Reconstruction';
import { applyPagination } from '../utils/pagination';
import PaginationQuery from '../domain/PaginationQuery';
import PaginatedResult from '../domain/PaginatedResult';
import ReconstructionState from '../domain/ReconstructionState';

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

export async function fetchReconstructionBatch(
  size: number
): Promise<Reconstruction[] | undefined> {
  return await Reconstruction.transaction(
    async (trx: Objection.Transaction) => {
      debug('Fetching reconstructions batch...');
      const reconstructions:
        | Reconstruction[]
        | undefined = await Reconstruction.query(trx)
        .withGraphFetched('[images]')
        .context({ sortOrder: 'ASC' })
        .modify(['orderByCreatedAt', 'inQueue'])
        .limit(size);

      if (reconstructions?.length > 0) {
        debug('Updating reconstructions state to in progress...');
        await Reconstruction.query(trx)
          .patch({
            state: ReconstructionState.INPROGRESS,
            updatedAt: new Date(),
          })
          .whereIn(
            'id',
            reconstructions.map((recon) => recon.id)
          );

        return reconstructions.map((recon) => {
          recon.state = ReconstructionState.INPROGRESS;
          return recon;
        });
      }
    }
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
  fetchReconstructionBatch,
  fetchReconstructionByUserId,
};
