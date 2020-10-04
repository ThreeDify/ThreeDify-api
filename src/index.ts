import http, { Server } from 'http';
import Debug, { Debugger } from 'debug';

import app from './app';
import config from './config';

const debug: Debugger = Debug('threedify:api');

app.set('port', config.port);

const server: Server = http.createServer(app);

server.listen(config.port);

server.on('listening', (): void => {
  debug(
    'Server listening on port: %d at %s:%d',
    config.port,
    config.baseUrl,
    config.port
  );
});

server.on('error', (error: NodeJS.ErrnoException): void => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  switch (error.code) {
    case 'EACCES':
      debug(`${config.port} requires elevated privileges`);
      process.exit(1);
    case 'EADDRINUSE':
      debug(`${config.port} is already in use`);
      process.exit(1);
    default:
      throw error;
  }
});
