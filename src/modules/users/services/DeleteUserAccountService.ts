import { injectable, inject } from 'tsyringe';

import AppError from '../../../shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/IHashProvider';

interface IRequest {
  user_id: string;
  password: string;
}

@injectable()
export default class DeleteUserAccountService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ user_id, password }: IRequest): Promise<void> {
    const userFound = await this.usersRepository.findById(user_id);

    if (!userFound) {
      throw new AppError('Authenticated user does not exists.');
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      userFound.password,
    );

    if (!passwordMatched) {
      throw new AppError('Invalid password');
    }

    await this.usersRepository.delete(userFound);
  }
}
