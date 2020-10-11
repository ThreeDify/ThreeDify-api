import { resolve } from 'path';
import { CorsOptions } from 'cors';
import { SignOptions } from 'jsonwebtoken';
import { Options as MulterOptions } from 'multer';

interface Config {
  port: number;
  baseUrl: string;
  saltRound: number;
  corsConfig: CorsOptions;
  uploadDirectory: string;
  requestLogFormat: string;
  accessTokenSecret: string;
  refreshTokenSecret: string;
  multerConfig: MulterOptions;
  supportedMimeTypes: string[];
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
  supportedMimeTypes: ['image/jpeg', 'image/png'],
  uploadDirectory: resolve(__dirname, '../uploads'),
  multerConfig: {
    dest: resolve(__dirname, '../uploads', 'tmp'),
  },
};

export default config;
