import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import AppError from '../../../../../shared/errors/AppError';
import authConfig from '../../../../../configs/auth';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const bearerToken = request.headers.authorization;

  if (!bearerToken) {
    throw new AppError('Token is missing on authorization header');
  }

  const [, token] = bearerToken.split(' ');
  const { secret } = authConfig.jwt;

  try {
    const decoded = verify(token, secret);

    const { sub } = decoded as ITokenPayload;

    request.user = {
      id: sub,
    };

    return next();
  } catch (err) {
    throw new AppError('Invalid JWT token.', 401);
  }
}
