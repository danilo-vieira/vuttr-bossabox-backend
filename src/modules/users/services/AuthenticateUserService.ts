import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import authConfig from '../../../configs/auth';

import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/IHashProvider';

import User from '../infra/typeorm/entities/User';
import AppError from '../../../shared/errors/AppError';

interface IRequest {
  email: string;
  password: string;
}

export interface IResponse {
  user: User;
  token: string;
}

@injectable()
export default class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const userFound = await this.usersRepository.findByEmail(email);

    if (!userFound) {
      throw new AppError('Invalid E-mail/password combination');
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      userFound.password,
    );

    if (!passwordMatched) {
      throw new AppError('Invalid E-mail/password combination');
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({ name: userFound.name }, secret, {
      subject: userFound.id,
      expiresIn,
    });

    return {
      user: userFound,
      token,
    };
  }
}
