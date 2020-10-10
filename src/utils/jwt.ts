import jwt from 'jsonwebtoken';

export function sign(
  payload: any,
  secret: string,
  options?: jwt.SignOptions
): string {
  return jwt.sign(payload, secret, options);
}

export function verify(token: string, secret: string): boolean {
  try {
    jwt.verify(token, secret);
    return true;
  } catch (err) {
    return false;
  }
}

export default {
  sign,
  verify,
};
