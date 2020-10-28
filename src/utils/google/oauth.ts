import { google } from 'googleapis';
import Debug, { Debugger } from 'debug';
import { OAuth2Client, Credentials } from 'google-auth-library';

import config from '../../config';

const debug: Debugger = Debug('threedify:utils:google:oauth');

export function getClient(): OAuth2Client {
  debug('Creating OAuth2 client...');
  return new google.auth.OAuth2(
    config.googleAPIConfig?.client_id,
    config.googleAPIConfig?.client_secret,
    config.googleAPIConfig?.redirect_url
  );
}

export function getAuthenticatedClient(): OAuth2Client {
  const client: OAuth2Client = getClient();

  authenticateClient(client, {
    refresh_token: config.googleAPIConfig?.refresh_token,
  });

  return client;
}

export function generateAuthUrl(client: OAuth2Client): string {
  return client.generateAuthUrl({
    access_type: 'offline',
    scope: config.googleAPIConfig?.scopes,
  });
}

export function authenticateClient(client: OAuth2Client, tokens: Credentials) {
  debug('Authenticating OAuth2 client...');
  client.setCredentials(tokens);
}

export async function fetchToken(
  client: OAuth2Client,
  authCode: string
): Promise<Credentials> {
  debug('Fetching access token..');
  const { tokens } = await client.getToken(authCode);
  return tokens;
}

export default {
  getClient,
  fetchToken,
  generateAuthUrl,
  authenticateClient,
  getAuthenticatedClient,
};
