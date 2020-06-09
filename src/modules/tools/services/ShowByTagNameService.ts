import { injectable, inject } from 'tsyringe';

import AppError from '../../../shared/errors/AppError';

import IUsersRepository from '../../users/repositories/IUsersRepository';
import IToolsRepository from '../repositories/IToolsRepository';
import parseToolWithOnlyTagName from '../utils/parseToolWithOnlyTagName';

interface IRequest {
  user_id: string;
  tag_name: string | undefined;
}

type IResponse = Array<{
  tags: string[];
}>;

@injectable()
export default class ShowByTagNameService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ToolsRepository')
    private toolsRepository: IToolsRepository,
  ) {}

  public async execute({ user_id, tag_name }: IRequest): Promise<IResponse> {
    const userFound = await this.usersRepository.findById(user_id);

    if (!userFound) {
      throw new AppError('Autheticated user dows not exists.');
    }

    const tools = await this.toolsRepository.findAllByUserId(user_id);

    let parsedTools = tools.map(tool => parseToolWithOnlyTagName(tool));

    if (tag_name) {
      parsedTools = parsedTools.filter(tool => tool.tags.includes(tag_name));
    }

    return parsedTools;
  }
}
