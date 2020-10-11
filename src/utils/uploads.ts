import { resolve } from 'path';
import { randomBytes } from 'crypto';
import { extension } from 'mime-types';
import Debug, { Debugger } from 'debug';
import { copyFileSync, existsSync, unlinkSync } from 'fs';

import config from '../config';

const debug: Debugger = Debug('threedify:utils:uploads');

function getRandomString(): string {
  return randomBytes(20).toString('hex');
}

function getFileName(): string {
  debug('Generating file name.');
  let newFileName: string = getRandomString();

  while (existsSync(resolve(config.uploadDirectory, newFileName))) {
    newFileName = getRandomString();
  }

  return newFileName;
}

export function isFileSupported(mimeType: string): boolean {
  return config.supportedMimeTypes.includes(mimeType);
}

export function saveFile(tmpFilePath: string, mimeType: string): string {
  debug('Saving file.');
  let fileName: string = getFileName() + '.' + extension(mimeType);

  copyFileSync(tmpFilePath, resolve(config.uploadDirectory, fileName));

  return fileName;
}

export function cleanUp(tmpFilePath: string) {
  debug('Removing tmp file.');
  unlinkSync(tmpFilePath);
}

export function upload(file: Express.Multer.File): string | undefined {
  debug('Uploading file.');
  let fileName: string = '';
  if (isFileSupported(file.mimetype)) {
    fileName = saveFile(file.path, file.mimetype);
  }

  cleanUp(file.path);
  return fileName;
}

export default {
  cleanUp,
  upload,
  saveFile,
  isFileSupported,
};
