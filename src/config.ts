import { CorsOptions } from 'cors';
import { SignOptions } from 'jsonwebtoken';

interface Config {
  port: number;
  baseUrl: string;
  saltRound: number;
  corsConfig: CorsOptions;
  requestLogFormat: string;
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenConfig: SignOptions;
  refreshTokenConfig: SignOptions;
}

const config: Config = {
  saltRound: 10,
  requestLogFormat: 'tiny',
  baseUrl: process.env.BASE_URL || '',
  port: +(process.env?.PORT || 3000),
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || '',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || '',
  accessTokenConfig: {
    algorithm: 'HS256',
    expiresIn: 7 * 60,
  },
  refreshTokenConfig: {
    algorithm: 'HS256',
    expiresIn: 7 * 24 * 60 * 60,
  },
  corsConfig: {
    origin: process.env.APP_BASE_URL,
    credentials: true,
  },
};

export default config;
