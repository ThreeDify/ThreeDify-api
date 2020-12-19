import readline from 'readline';
import { ValidationResult } from 'joi';
import Debug, { Debugger } from 'debug';

import db from '../src/utils/db';
import NewApp from '../src/domain/NewApp';
import appAuth from '../src/services/appAuth';
import NewAppValidationSchema from '../src/validationSchema/NewAppValidationSchema';

const debug: Debugger = Debug('threedify:script:generateApp');

async function question(
  rl: readline.Interface,
  question: string
): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer));
  });
}

(async () => {
  const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    debug('Connecting to database...');
    db.init();

    debug('Enter app details...');
    const newApp: NewApp = {
      name: await question(reader, 'App name? '),
      domain: await question(reader, 'App domain? '),
    };
    reader.close();

    debug('Validating app details...');
    const result: ValidationResult = NewAppValidationSchema.validate(newApp, {
      abortEarly: false,
    });

    if (result.error) {
      debug('Validation failed...');
      debug('Validation Errors: %O', result.error.details);

      process.exit(1);
    }

    debug('Creating app...');
    const validatedApp: NewApp = result.value;
    const app = await appAuth.createNewApp(validatedApp);

    debug('Save the app key and secret...');
    debug('App Key: %s', app?.key);
    debug('App Secret: %s', app?.rawSecret);
  } catch (err) {
    debug('Oops! an error occurred: %O', err);
    process.exit(2);
  }

  process.exit(0);
})();
