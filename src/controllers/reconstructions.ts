import Debug, { Debugger } from 'debug';
import { Request, NextFunction, Response } from 'express';

import Reconstruction from '../models/Reconstruction';
import PaginationQuery from '../domain/PaginationQuery';
import PaginatedResult from '../domain/PaginatedResult';
import { getPaginationQuery } from '../utils/pagination';
import NewReconstruction from '../domain/NewReconstruction';
import reconstructionService from '../services/reconstructions';
import ReconstructionState from '../domain/ReconstructionState';
import { AuthRequestWithImages } from '../middlewares/uploadImage';
import ReconstructionCreationResponse from '../domain/ReconstructionCreationResponse';
import { AuthRequestWithReconstructionFile } from '../middlewares/uploadReconstruction';

const debug: Debugger = Debug('threedify:controller:reconstructions');

export async function index(
  req: Request,
  res: Response<PaginatedResult<Reconstruction>>,
  next: NextFunction
) {
  try {
    const paginationQuery: PaginationQuery = getPaginationQuery(req.query);

    const reconstructions:
      | PaginatedResult<Reconstruction>
      | undefined = await reconstructionService.fetchAllReconstructions(
      paginationQuery
    );

    if (reconstructions) {
      res.json(reconstructions);
      return;
    }

    next({
      status: 404,
      message: 'Reconstructions not found.',
    });
  } catch (err) {
    debug('ERROR: %O', err);

    next({
      status: 500,
      message: 'Error occurred while fetching reconstructions.',
      ...err,
    });
  }
}

export async function reconstruction(
  req: Request,
  res: Response<Reconstruction>,
  next: NextFunction
) {
  try {
    debug('Fetching requested reconstruction: %d', +req.params.id);
    let reconstruction:
      | Reconstruction
      | undefined = await reconstructionService.fetchReconstructionById(
      +req.params.id
    );

    if (reconstruction) {
      res.json(reconstruction);
      return;
    }

    next({
      status: 404,
      message: 'Reconstruction not found.',
    });
  } catch (err) {
    debug('ERROR: %O', err);

    next({
      status: 500,
      message: 'Error occurred while fetching reconstruction.',
      ...err,
    });
  }
}

export async function reconstructionFailed(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    debug('Fetching requested reconstruction: %d', +req.params.id);
    let reconstruction:
      | Reconstruction
      | undefined = await reconstructionService.fetchReconstructionById(
      +req.params.id
    );

    if (reconstruction) {
      // TODO: Add process logs for the reconstruction and failed state.

      debug('Setting state of reconstruction to in queue.');
      await reconstructionService.setState(
        reconstruction,
        ReconstructionState.INQUEUE
      );

      res.sendStatus(200);
      return;
    }

    next({
      status: 404,
      message: 'Reconstruction not found.',
    });
  } catch (err) {
    debug('ERROR: %O', err);

    next({
      status: 500,
      message: 'Error occurred while updating reconstruction state.',
      ...err,
    });
  }
}

export async function reconstructionCompleted(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authReq: AuthRequestWithReconstructionFile = req as AuthRequestWithReconstructionFile;

  try {
    debug('Fetching requested reconstruction: %d', +req.params.id);
    let reconstruction:
      | Reconstruction
      | undefined = await reconstructionService.fetchReconstructionById(
      +req.params.id
    );

    if (reconstruction) {
      // TODO: Add process logs for the reconstruction and completed state.

      debug('Setting state of reconstruction to completed.');
      await reconstructionService.markAsCompleted(
        reconstruction,
        authReq.reconstructionFileName
      );

      res.sendStatus(200);
      return;
    }

    next({
      status: 404,
      message: 'Reconstruction not found.',
    });
  } catch (err) {
    debug('ERROR: %O', err);

    next({
      status: 500,
      message: 'Error occurred while updating reconstruction state.',
      ...err,
    });
  }
}

export async function reconstructionBatch(
  req: Request,
  res: Response<Reconstruction[]>,
  next: NextFunction
) {
  try {
    let reconstruction:
      | Reconstruction[]
      | undefined = await reconstructionService.fetchReconstructionBatch(
      +req.params.size || 10
    );

    if (reconstruction) {
      res.json(reconstruction);
      return;
    }

    next({
      status: 404,
      message: 'Reconstructions not found.',
    });
  } catch (err) {
    debug('ERROR: %O', err);

    next({
      status: 500,
      message: 'Error occurred while fetching reconstructions.',
      ...err,
    });
  }
}

export async function userReconstruction(
  req: Request,
  res: Response<PaginatedResult<Reconstruction>>,
  next: NextFunction
) {
  try {
    const paginationQuery: PaginationQuery = getPaginationQuery(req.query);

    const reconstructions:
      | PaginatedResult<Reconstruction>
      | undefined = await reconstructionService.fetchReconstructionByUserId(
      +req.params.userId,
      paginationQuery
    );

    if (reconstructions) {
      res.json(reconstructions);
      return;
    }

    next({
      status: 404,
      message: 'Reconstructions not found.',
    });
  } catch (err) {
    debug('ERROR: %O', err);

    next({
      status: 500,
      message: 'Error occurred while fetching reconstructions for user.',
      ...err,
    });
  }
}

export async function create(
  req: Request,
  res: Response<ReconstructionCreationResponse>,
  next: NextFunction
) {
  const authReq: AuthRequestWithImages<
    {},
    ReconstructionCreationResponse,
    NewReconstruction
  > = req as AuthRequestWithImages<
    {},
    ReconstructionCreationResponse,
    NewReconstruction
  >;
  try {
    debug('Creating reconstruction.');
    let reconstruction: Reconstruction = await reconstructionService.insertReconstruction(
      {
        createdBy: authReq.user.id,
        name: authReq.body.reconstruction_name,
      }
    );

    if (reconstruction.id && authReq.images) {
      debug('Adding images for reconstruction.');

      reconstruction = await reconstructionService.addImages(
        reconstruction,
        authReq.images
      );
    }

    res.json({
      reconstruction: reconstruction,
      errors: authReq.fileValidationErrors,
    });
  } catch (err) {
    debug('ERROR: %O', err);

    next({
      status: 500,
      message: 'Error occurred while creating reconstruction.',
      ...err,
    });
  }
}

export default {
  index,
  create,
  reconstruction,
  userReconstruction,
  reconstructionBatch,
  reconstructionFailed,
  reconstructionCompleted,
};
