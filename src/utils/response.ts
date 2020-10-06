import { NextFunction, Request, Response } from 'express';

export function sendStatus(status: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(status);
  };
}
