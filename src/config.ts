import { CorsOptions } from 'cors';

interface Config {
  port: number;
  baseUrl: string;
  saltRound: number;
  corsConfig: CorsOptions;
  requestLogFormat: string;
}

const config: Config = {
  saltRound: 10,
  requestLogFormat: 'tiny',
  baseUrl: process.env.BASE_URL || '',
  port: +(process.env?.PORT || 3000),
  corsConfig: {
    origin: process.env.APP_BASE_URL,
    credentials: true
  },
};

export default config;
