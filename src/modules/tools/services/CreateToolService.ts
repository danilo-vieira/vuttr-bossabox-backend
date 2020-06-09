import { injectable, inject } from 'tsyringe';

import AppError from '../../../shared/errors/AppError';

import IUsersRepository from '../../users/repositories/IUsersRepository';
import IToolsRepository from '../repositories/IToolsRepository';
import ITagsRepository from '../../tags/repositories/ITagsRepository';

import Tool from '../infra/typeorm/entities/Tool';

interface IRequest {
  user_id: string;
  title: string;
  link: string;
  description: string;
  tags: string[];
}

@injectable()
export default class CreateToolService {
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
    title,
    link,
    description,
    tags,
  }: IRequest): Promise<Tool> {
    const userFound = await this.usersRepository.findById(user_id);

    if (!userFound) {
      throw new AppError('Authenticated user not found.');
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

    const tool = await this.toolsRepository.create({
      user_id,
      title,
      link,
      description,
      tags: createdTags,
    });

    return tool;
  }
}
