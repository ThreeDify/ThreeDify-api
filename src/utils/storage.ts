import Debug, { Debugger } from 'debug';

import config from '../config';
import StorageAPI from '../domain/StorageAPI';
import localDiskStorage from './localDiskStorage';
import googleDriveStorage from './google/googleDriveStorage';

const debug: Debugger = Debug('threedify:utils:storage');

export function getStorageAPI(): StorageAPI {
  switch (config.storageAPI) {
    case 'local':
      return localDiskStorage;
    case 'drive':
      return googleDriveStorage;
    default:
      throw new Error(`Storage API (${config.storageAPI}) not Implemented.`);
  }
}

export async function saveFile(
  tmpFilePath: string,
  filePath: string,
  mimeType: string
) {
  const storageAPI: StorageAPI = getStorageAPI();

  await storageAPI.saveFile(tmpFilePath, filePath, mimeType);
}

export async function unlinkFile(filePath: string) {
  await getStorageAPI().unlinkFile(filePath);
}

export default {
  saveFile,
  unlinkFile,
  getStorageAPI,
};
