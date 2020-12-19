import { unlinkSync } from 'fs';
import { randomBytes } from 'crypto';
import { extension } from 'mime-types';
import Debug, { Debugger } from 'debug';

import config from '../config';
import { saveFile } from './storage';
import { getStorageAPI } from './storage';
import StorageAPI, { AvailableStorageAPI } from '../domain/StorageAPI';

const debug: Debugger = Debug('threedify:utils:uploads');

function getRandomString(): string {
  return randomBytes(20).toString('hex');
}

export function isFileSupported(
  mimeType: string,
  supportedMimeTypes: string[]
): boolean {
  return supportedMimeTypes.includes(mimeType);
}

export function getUploadDirectory(): string {
  switch (config.storageAPI) {
    case AvailableStorageAPI.LOCAL:
      return config.uploadDirectory;
    case AvailableStorageAPI.DRIVE:
      if (!config.googleAPIConfig) {
        debug(
          'Google API not configured correctly. Cannot get upload directory id.'
        );
        throw new Error('Google API not configured correctly.');
      }
      return config.googleAPIConfig.upload_directory_id;
    default:
      throw new Error(`Storage API (${config.storageAPI}) not Implemented.`);
  }
}

async function getFileName(mimeType: string): Promise<string[]> {
  const storageAPI: StorageAPI = getStorageAPI();
  const uploadDirectory: string = getUploadDirectory();

  debug('Generating file name.');
  let newFileName: string = '';
  let filePath: string = '';

  do {
    newFileName = getRandomString() + '.' + extension(mimeType);
    filePath = await storageAPI.getFilePath(uploadDirectory, newFileName);
  } while (await storageAPI.fileExists(filePath));

  return [newFileName, filePath];
}

export function cleanUp(tmpFilePath: string) {
  debug('Removing tmp file.');
  unlinkSync(tmpFilePath);
}

export async function upload(
  file: Express.Multer.File,
  supportedMimeTypes: string[]
): Promise<string> {
  debug('Uploading file.');
  let fileName: string = '';
  let filePath: string = '';

  if (isFileSupported(file.mimetype, supportedMimeTypes)) {
    [fileName, filePath] = await getFileName(file.mimetype);
    await saveFile(file.path, filePath, file.mimetype);
  }

  cleanUp(file.path);
  return fileName;
}

export default {
  cleanUp,
  upload,
  isFileSupported,
  getUploadDirectory,
};
