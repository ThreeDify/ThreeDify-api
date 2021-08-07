import { Readable } from 'stream';
import { lookup } from 'mime-types';
import Debug, { Debugger } from 'debug';
import { Request, NextFunction, Response } from 'express';

import StorageAPI from '../domain/StorageAPI';
import { getStorageAPI } from '../utils/storage';
import Reconstruction from '../models/Reconstruction';
import { getUploadDirectory } from '../utils/uploads';
import PaginationQuery from '../domain/PaginationQuery';
import PaginatedResult from '../domain/PaginatedResult';
import { getPaginationQuery } from '../utils/pagination';
import NewReconstruction from '../domain/NewReconstruction';
import reconstructionService from '../services/reconstructions';
import ReconstructionState from '../domain/ReconstructionState';
import { AuthRequestWithImages } from '../middlewares/uploadImage';
import { AuthenticatedRequest } from '../middlewares/authenticateUser';
import ReconstructionCreationResponse from '../domain/ReconstructionCreationResponse';
import { AuthRequestWithReconstructionFile } from '../middlewares/uploadReconstruction';

const debug: Debugger = Debug('threedify:controller:reconstructions');

export async function index(
  req: Request,
  res: Response<PaginatedResult<Reconstruction>>,
  next: NextFunction
): Promise<void> {
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
): Promise<void> {
  try {
    debug('Fetching requested reconstruction: %d', +req.params.id);
    const reconstruction:
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
): Promise<void> {
  try {
    debug('Fetching requested reconstruction: %d', +req.params.id);
    const reconstruction:
      | Reconstruction
      | undefined = await reconstructionService.fetchReconstructionById(
      +req.params.id
    );

    if (reconstruction) {
      // TODO: Add process logs for the reconstruction and failed state.

      debug('Setting state of reconstruction to failed.');
      await reconstructionService.setState(
        reconstruction,
        ReconstructionState.FAILED
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
): Promise<void> {
  const authReq: AuthRequestWithReconstructionFile = req as AuthRequestWithReconstructionFile;

  try {
    debug('Fetching requested reconstruction: %d', +req.params.id);
    const reconstruction:
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

export async function reconstructionFile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    debug('Fetching requested reconstruction: %d', +req.params.id);
    const reconstruction:
      | Reconstruction
      | undefined = await reconstructionService.fetchReconstructionById(
      +req.params.id,
      true
    );

    debug('Check if reconstruction exists and completed.');
    if (reconstruction && reconstruction.reconstructionFile) {
      const storageAPI: StorageAPI = getStorageAPI();
      const filePath: string = await storageAPI.getFilePath(
        getUploadDirectory(),
        reconstruction.reconstructionFile
      );

      debug('Check if reconstruction file exists.');
      if (await storageAPI.fileExists(filePath)) {
        const stream: Readable = await storageAPI.openReadStream(filePath);

        res.setHeader(
          'Content-Type',
          lookup(reconstruction.reconstructionFile) || 'text/plain'
        );
        stream.pipe(res);

        return;
      }
    }

    next({
      status: 404,
      message: 'Reconstruction file not found.',
    });
  } catch (err) {
    debug('ERROR: %O', err);

    next({
      status: 500,
      message: 'Error occurred while fetching reconstruction file.',
      ...err,
    });
  }
}

export async function reconstructionBatch(
  req: Request,
  res: Response<Reconstruction[]>,
  next: NextFunction
): Promise<void> {
  try {
    const reconstruction:
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
): Promise<void> {
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
): Promise<void> {
  const authReq: AuthenticatedRequest<
    unknown,
    ReconstructionCreationResponse,
    NewReconstruction
  > = req as AuthRequestWithImages<
    unknown,
    ReconstructionCreationResponse,
    NewReconstruction
  >;
  try {
    debug('Creating reconstruction.');
    const reconstruction: Reconstruction = await reconstructionService.insertReconstruction(
      {
        createdBy: authReq.user.id,
        name: authReq.body.reconstruction_name,
      }
    );

    res.json({
      reconstruction: reconstruction,
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

export async function addImage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authReq: AuthRequestWithImages = req as AuthRequestWithImages;

  try {
    debug('Fetching requested reconstruction: %d', +req.params.id);
    let reconstruction:
      | Reconstruction
      | undefined = await reconstructionService.fetchReconstructionById(
      +req.params.id
    );

    if (reconstruction) {
      debug('Adding new image for reconstruction.');
      reconstruction = await reconstructionService.addImages(
        reconstruction,
        authReq.images
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
      message: 'Error occurred while adding image to reconstruction.',
      ...err,
    });
  }
}

export default {
  index,
  create,
  addImage,
  reconstruction,
  userReconstruction,
  reconstructionFile,
  reconstructionBatch,
  reconstructionFailed,
  reconstructionCompleted,
};
