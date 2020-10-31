import { google } from 'googleapis';
import Debug, { Debugger } from 'debug';
import { OAuth2Client } from 'google-auth-library';

import { getAuthenticatedClient } from '../src/utils/google/oauth';

const debug: Debugger = Debug('threedify:script:listDriveFiles');

(async () => {
  const client: OAuth2Client = getAuthenticatedClient();

  const drive = google.drive({ version: 'v3', auth: client });
  drive.files.list(
    {
      pageSize: 100,
      fields: 'nextPageToken, files(id, name)',
    },
    (err, res: any) => {
      if (err) return debug('The API returned an error: %O', err);
      const files = res.data.files;
      if (files.length) {
        debug(
          'Files: %O',
          files.map((file: any) => {
            return `${file.name} (${file.id})`;
          })
        );
      } else {
        debug('No files found.');
      }
    }
  );
})();
