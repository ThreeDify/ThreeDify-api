import open from 'open';
import readline from 'readline';
import Debug, { Debugger } from 'debug';
import { OAuth2Client } from 'google-auth-library';

import {
  fetchToken,
  getClient,
  generateAuthUrl,
} from '../src/utils/google/oauth';

const debug: Debugger = Debug('threedify:script:generateGoogleToken');

(async () => {
  const client: OAuth2Client = getClient();

  debug('Generating Auth url...');
  const authUrl = generateAuthUrl(client);

  debug('Opening Authentication url in browser.');
  await open(authUrl);

  const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  await reader.question('Enter the code here:', async (authCode) => {
    reader.close();
    const tokens = await fetchToken(client, authCode);
    debug('Tokens: %O', tokens);
  });
})();
