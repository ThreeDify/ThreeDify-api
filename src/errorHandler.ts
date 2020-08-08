import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';

export interface HttpErrorResponse {
  code: number;
  message: string;
  error?: createError.HttpError;
}

export function handle404(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  next(createError(404));
}

export function handleError(
  err: createError.HttpError,
  req: Request,
  res: Response<HttpErrorResponse>,
  next: NextFunction
) {
  res.status(err.status || 500);
  res.json({
    code: err.status,
    message: err.message,
    error: req.app.get('env') === 'development' ? err : undefined,
  });
}
