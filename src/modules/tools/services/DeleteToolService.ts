import { injectable, inject } from 'tsyringe';

import AppError from '../../../shared/errors/AppError';

import IUsersRepository from '../../users/repositories/IUsersRepository';
import IToolsRepository from '../repositories/IToolsRepository';

interface IRequest {
  user_id: string;
  tool_id: string;
}

@injectable()
export default class DeleteToolService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ToolsRepository')
    private toolsRepository: IToolsRepository,
  ) {}

  public async execute({ user_id, tool_id }: IRequest): Promise<void> {
    const userFound = await this.usersRepository.findById(user_id);

    if (!userFound) {
      throw new AppError('Authenticated user does not exists.');
    }

    const toolFound = await this.toolsRepository.findById(tool_id);

    if (!toolFound) {
      throw new AppError('Tool does not exists.');
    }

    if (userFound.id !== toolFound.user_id) {
      throw new AppError(
        'This tool does not belongs to the authenticated user ',
      );
    }

    await this.toolsRepository.delete(toolFound);
  }
}
