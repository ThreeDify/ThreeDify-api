import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';

import HTTPError from './domain/HttpError';

export function handle404(
  req: Request,
  res: Response<HTTPError>,
  next: NextFunction
): void {
  next(createError(404));
}

export function handleError(
  err: createError.HttpError,
  req: Request,
  res: Response<HTTPError>,
  next: NextFunction
) {
  res.status(err.status || 500);
  res.json({
    code: err.status,
    message: err.message,
    error: req.app.get('env') === 'development' ? err : undefined,
  });
}
