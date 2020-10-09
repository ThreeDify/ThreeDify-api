import jwt from 'jsonwebtoken';

export function sign(
  payload: any,
  secret: string,
  options?: jwt.SignOptions
): string {
  return jwt.sign(payload, secret, options);
}

export function verify(token: string, secret: string): any {
  return jwt.verify(token, secret);
}

export default {
  sign,
  verify,
};
