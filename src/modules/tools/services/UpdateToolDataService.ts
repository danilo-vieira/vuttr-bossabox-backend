import { inject, injectable } from 'tsyringe';

import AppError from '../../../shared/errors/AppError';

import IUsersRepository from '../../users/repositories/IUsersRepository';
import IToolsRepository from '../repositories/IToolsRepository';
import ITagsRepository from '../../tags/repositories/ITagsRepository';

import Tool from '../infra/typeorm/entities/Tool';

interface IRequest {
  user_id: string;
  tool_id: string;
  title: string;
  link: string;
  description: string;
  tags: string[];
}

@injectable()
export default class UpdateToolDataService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ToolsRepository')
    private toolsRepository: IToolsRepository,

    @inject('TagsRepository')
    private tagsRepository: ITagsRepository,
  ) {}

  public async execute({
    user_id,
    tool_id,
    title,
    link,
    description,
    tags,
  }: IRequest): Promise<Tool> {
    const userFound = await this.usersRepository.findById(user_id);

    if (!userFound) {
      throw new AppError('Authenticated user does not exists');
    }

    const toolFound = await this.toolsRepository.findById(tool_id);

    if (!toolFound) {
      throw new AppError('Tool does not exists');
    }

    if (toolFound.user_id !== userFound.id) {
      throw new AppError('The tool does not belongs to this user');
    }

    const tagsFound = await this.tagsRepository.findAllByNames(tags);

    let createdTags = tagsFound;

    if (tagsFound.length === 0) {
      createdTags = await this.tagsRepository.create(tags);
    }

    if (tagsFound.length !== 0 && tagsFound.length !== tags.length) {
      const notCreatedTags = tags.filter(tag => {
        const tagsParsed = tagsFound.map(tagFound => tagFound.name);

        return !tagsParsed.includes(tag);
      });

      const aditionalTags = await this.tagsRepository.create(notCreatedTags);

      createdTags = [...createdTags, ...aditionalTags];
    }

    const editedTool = {
      ...toolFound,
      title,
      link,
      description,
      tags: createdTags,
    };

    return this.toolsRepository.save(editedTool);
  }
}
