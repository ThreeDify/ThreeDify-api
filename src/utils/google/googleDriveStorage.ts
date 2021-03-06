import { Readable } from 'stream';
import Debug, { Debugger } from 'debug';
import { drive_v3, google } from 'googleapis';

import { getAuthenticatedClient } from './oauth';
import { resumableFileUpload } from './resumableUpload';

const debug: Debugger = Debug('threedify:utils:google:googleDriveStorage');

function getClient(): drive_v3.Drive {
  debug('Creating google drive client...');
  return google.drive({ version: 'v3', auth: getAuthenticatedClient() });
}

export async function fileExists(filePath: string): Promise<boolean> {
  debug('Check if file (%s) exists in google drive.', filePath);
  const [uploadDirId, fileName] = filePath.split('/');
  const fileLists = await getClient().files.list({
    q: `name='${fileName}' and trashed=false${
      uploadDirId ? ` and parents in '${uploadDirId}'` : ''
    }`,
  });

  return !!fileLists.data.files?.length;
}

export async function unlinkFile(filePath: string): Promise<void> {
  debug('Getting file name and upload directory id...');
  const [uploadDirId, fileName] = filePath.split('/');

  const client = getClient();
  debug('Searching for file...');
  const fileLists = await client.files.list({
    q: `name='${fileName}' and trashed=false${
      uploadDirId ? ` and parents in '${uploadDirId}'` : ''
    }`,
  });

  if (fileLists.data.files?.length && fileLists.data.files[0].id) {
    debug('Deleting file...');
    await client.files.delete({
      fileId: fileLists.data.files[0].id,
    });

    debug('Emptying trash...');
    await client.files.emptyTrash();
  }
}

export async function saveFile(
  tmpFilePath: string,
  filePath: string,
  mimeType: string
): Promise<void> {
  debug('Getting file name and upload directory id...');
  const [uploadDirId, fileName] = filePath.split('/');

  await resumableFileUpload(tmpFilePath, uploadDirId, fileName, mimeType);
}

export async function openReadStream(filePath: string): Promise<Readable> {
  debug('Getting file name and upload directory id...');
  const [uploadDirId, fileName] = filePath.split('/');

  const client = getClient();

  debug('Getting file id if file exists...');
  const fileLists = await client.files.list({
    q: `name='${fileName}' and trashed=false${
      uploadDirId ? ` and parents in '${uploadDirId}'` : ''
    }`,
  });

  if (fileLists.data.files?.length && fileLists.data.files[0].id) {
    const fileId = fileLists.data.files[0].id;

    debug('Downloading file from google drive...');
    let response = await client.files.get(
      {
        fileId: fileId,
        alt: 'media',
      },
      { responseType: 'stream' }
    );

    return response.data;
  }

  throw new Error('File not found.');
}

export async function getFilePath(
  directory: string,
  fileName: string
): Promise<string> {
  return `${directory}/${fileName}`;
}

export default {
  saveFile,
  fileExists,
  unlinkFile,
  getFilePath,
  openReadStream,
};
