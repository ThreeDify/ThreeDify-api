import { CorsOptions } from 'cors';
import { SessionOptions } from 'express-session';

interface Config {
  port: number;
  baseUrl: string;
  hashAlgo: string;
  corsConfig: CorsOptions;
  requestLogFormat: string;
  sessionConfig: SessionOptions;
}

const config: Config = {
  hashAlgo: 'sha256',
  requestLogFormat: 'tiny',
  baseUrl: process.env.BASE_URL || '',
  port: +(process.env?.PORT || 3000),
  sessionConfig: {
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || '',
    cookie: {
      httpOnly: true,
      sameSite: true,
      maxAge: +(process.env?.SESSION_DURATION || 86400) * 1000,
    },
  },
  corsConfig: {
    origin: process.env.APP_BASE_URL,
  },
};

export default config;
