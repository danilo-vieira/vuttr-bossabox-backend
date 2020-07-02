import { container } from 'tsyringe';

import '../../modules/users/providers';

import IUsersRepository from '../../modules/users/repositories/IUsersRepository';
import UsersRepository from '../../modules/users/infra/typeorm/repositories/UsersRespository';

import IToolsRepository from '../../modules/tools/repositories/IToolsRepository';
import ToolsRepository from '../../modules/tools/infra/typeorm/repositories/ToolsRepository';

import ITagsRepository from '../../modules/tags/repositories/ITagsRepository';
import TagsRepository from '../../modules/tags/infra/typeorm/repositories/TagsRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IToolsRepository>(
  'ToolsRepository',
  ToolsRepository,
);

container.registerSingleton<ITagsRepository>('TagsRepository', TagsRepository);
