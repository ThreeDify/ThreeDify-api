import { resolve } from 'path';
import { CorsOptions } from 'cors';
import { SignOptions } from 'jsonwebtoken';
import { Options as MulterOptions } from 'multer';
import { Options as SwaggerOptions } from 'swagger-jsdoc';

import packageJson from '../package.json';

import { SortOrder } from './domain/PaginationQuery';
import GoogleAPIConfig from './domain/GoogleAPIConfig';
import PaginationConfig from './domain/PaginationConfig';

interface Config {
  port: number;
  baseUrl: string;
  saltRound: number;
  storageAPI: string;
  corsConfig: CorsOptions;
  uploadDirectory: string;
  requestLogFormat: string;
  accessTokenSecret: string;
  refreshTokenSecret: string;
  multerConfig: MulterOptions;
  supportedMimeTypes: string[];
  swaggerConfig: SwaggerOptions;
  accessTokenConfig: SignOptions;
  refreshTokenConfig: SignOptions;
  googleAPIConfig?: GoogleAPIConfig;
  paginationConfig: PaginationConfig;
}

const config: Config = {
  saltRound: 10,
  requestLogFormat: 'tiny',
  baseUrl: process.env.BASE_URL || '',
  port: +(process.env?.PORT || 3000),
  storageAPI: process.env.STORAGE_API || 'local',
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
  swaggerConfig: {
    definition: {
      openapi: '3.0.0',
      info: {
        title: packageJson.name,
        version: packageJson.version,
        description: packageJson.description,
      },
    },
    apis: [
      resolve(__dirname, 'domain/*.*'),
      resolve(__dirname, 'models/*.*'),
      resolve(__dirname, 'routers/*.*'),
    ],
  },
  googleAPIConfig: {
    client_id: process.env.GOOGLE_CLIENT_ID || '',
    scopes: ['https://www.googleapis.com/auth/drive'],
    client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirect_url: process.env.GOOGLE_REDIRECT_URL || '',
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN || '',
    upload_directory_id: process.env.GOOGLE_DRIVE_UPLOAD_FOLDER_ID || '',
  },
  paginationConfig: {
    minPageSize: 10,
    defaultOrder: SortOrder.ASC,
  },
};

export default config;
