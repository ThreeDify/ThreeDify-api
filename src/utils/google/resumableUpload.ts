import { Stream } from 'stream';
import parseRange from 'range-parser';
import Debug, { Debugger } from 'debug';
import { createReadStream, statSync } from 'fs';
import { OAuth2Client } from 'google-auth-library';

import { getAuthenticatedClient } from './oauth';

const RESUMABLE_FILE_UPLOAD_URL: string =
  'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable';

const debug: Debugger = Debug('threedify:utils:google:resumableUpload');

async function initiate(client: OAuth2Client, metadata: any) {
  debug('Initiating a resumable upload...');
  let response = await client.request({
    method: 'POST',
    url: RESUMABLE_FILE_UPLOAD_URL,
    body: JSON.stringify(metadata),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
  });

  return response.headers.location;
}

async function upload(
  client: OAuth2Client,
  sessionURL: string,
  data: Stream,
  fileSize: number,
  rangeStart: number,
  maxTry: number = 10
): Promise<boolean> {
  let result: boolean = false;
  let newRangeStart: number = rangeStart;
  let tries: number = 1;

  do {
    try {
      debug('Uploading file content...(Tries %d/%d)', tries, maxTry);
      await client.request({
        method: 'PUT',
        url: sessionURL,
        headers: {
          'Content-Length': fileSize,
          'Content-Range': `bytes ${newRangeStart}-${fileSize - 1}/${fileSize}`,
        },
        data: data,
      });

      [result, newRangeStart] = await checkUploadStatus(
        client,
        sessionURL,
        fileSize
      );

      continue;
    } catch (err) {
      [result, newRangeStart] = await checkUploadStatus(
        client,
        sessionURL,
        fileSize
      );

      if (newRangeStart === -1) {
        return false;
      }
    }
    tries++;
    if (tries <= maxTry) debug('Resumming upload...');
  } while (!result && tries <= maxTry);

  debug('File uploaded successfully...');
  return true;
}

async function checkUploadStatus(
  client: OAuth2Client,
  sessionURL: string,
  fileSize: number
): Promise<[boolean, number]> {
  try {
    debug('Checking file upload status...');
    let response = await client.request({
      method: 'PUT',
      url: sessionURL,
      headers: {
        'Content-Range': `bytes */${fileSize}`,
      },
    });

    let status = response.status;
    if (status === 308) {
      let range = parseRange(fileSize, response.headers.range, {
        combine: true,
      });

      if (range !== -1 && range !== -2) {
        debug(
          'Upload interrupted (%d/%d bytes uploaded).',
          range[0].end,
          fileSize
        );
        return [false, range[0].end + 1];
      }

      return [false, 0];
    }

    return [true, 0];
  } catch (err) {
    let status = err.response?.status || 404;

    if (status in [200, 201]) {
      return [true, 0];
    } else if (status === 308) {
      let range = parseRange(fileSize, err.response?.headers.range, {
        combine: true,
      });

      if (range !== -1 && range !== -2) {
        debug(
          'Upload interrupted (%d/%d bytes uploaded).',
          range[0].end,
          fileSize
        );
        return [false, range[0].end + 1];
      }

      return [false, 0];
    }
  }

  debug('Upload session expired.');
  return [false, -1];
}

export async function resumableFileUpload(
  sourceFilePath: string,
  uploadDirId: string,
  destinationFileName: string,
  mimeType: string,
  maxTry: number = 5
) {
  debug('Getting size of file to upload...');
  const fileSize: number = statSync(sourceFilePath).size;

  debug('Creating metadata for file...');
  let metadata = {
    name: destinationFileName,
    mimeType: mimeType,
    parents: [uploadDirId],
  };

  let client: OAuth2Client = getAuthenticatedClient();
  let uploadCompleted = false;
  let tries: number = 1;

  do {
    try {
      let sessionURL = await initiate(client, metadata);
      uploadCompleted = await upload(
        client,
        sessionURL,
        createReadStream(sourceFilePath),
        fileSize,
        0
      );

      if (uploadCompleted) {
        return;
      }
    } catch (err) {
      debug('Error: %O', err);
      uploadCompleted = false;
    }
    tries++;
    if (tries <= maxTry) debug('Retrying...');
  } while (!uploadCompleted && tries <= maxTry);

  if (!uploadCompleted) {
    throw new Error('Could not upload file.');
  }
}

export default { resumableFileUpload };
