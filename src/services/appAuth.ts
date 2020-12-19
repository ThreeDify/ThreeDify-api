import crypto from 'crypto';
import Debug, { Debugger } from 'debug';

import App from '../models/App';
import appService from './apps';
import uuid from '../utils/uuid';
import NewApp from '../domain/NewApp';
import { hash, compare } from '../utils/hash';
import AppCredential from '../domain/AppCredential';

const debug: Debugger = Debug('threedify:services:appAuth');

export async function createNewApp(
  newApp: NewApp
): Promise<NewApp | undefined> {
  debug('Creating new app.');

  newApp.key = uuid.generate();
  newApp.rawSecret = crypto.randomBytes(20).toString('base64');

  debug('Hashing app secret.');
  const hashedSecret: string = await hash(newApp.rawSecret || '');

  const app: Partial<App> = {
    key: newApp.key,
    name: newApp.name,
    secret: hashedSecret,
    domain: newApp.domain,
  };

  debug('Inserting app record.');
  await appService.insertApp(app);

  return newApp;
}

export async function authenticate(
  appCred: AppCredential
): Promise<App | undefined> {
  debug('Check if app key and secret exists.');
  if (!appCred.key || !appCred.secret) {
    return;
  }

  debug('Check if the app exists.');
  const app: App | undefined = await appService.fetchAppByKey(appCred.key);
  if (app) {
    debug('Check if secret matches.');
    const secretMatched: boolean = await compare(appCred.secret, app.secret);

    if (secretMatched) {
      return app;
    }
  }

  return;
}

export default {
  createNewApp,
  authenticate,
};
