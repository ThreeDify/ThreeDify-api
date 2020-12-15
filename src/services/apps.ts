import Debug, { Debugger } from 'debug';

import App from '../models/App';

const debug: Debugger = Debug('threedify:services:apps');

export async function fetchAppByKey(key: string): Promise<App | undefined> {
  debug('Fetching app with key: %s.', key);

  return await App.query().where('key', '=', key).first();
}

export async function insertApp(app: Partial<App>): Promise<App> {
  debug('Inserting app.');

  return await App.query().insert(app);
}

export default {
  insertApp,
  fetchAppByKey,
};
