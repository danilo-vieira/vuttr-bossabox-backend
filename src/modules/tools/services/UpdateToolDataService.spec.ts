import AppError from '../../../shared/errors/AppError';

import FakeUsersRepository from '../../users/repositories/fakes/FakeUsersRepository';
import FakeToolsRepository from '../repositories/fakes/FakeToolsRepository';
import FakeTagsRepository from '../../tags/repositories/fakes/FakeTagsRepository';

import UpdateToolDataService from './UpdateToolDataService';

import User from '../../users/infra/typeorm/entities/User';
import Tag from '../../tags/infra/typeorm/entities/Tag';
import Tool from '../infra/typeorm/entities/Tool';

let fakeUsersRepository: FakeUsersRepository;
let fakeTagsRepository: FakeTagsRepository;
let fakeToolsRepository: FakeToolsRepository;

let updateToolDataService: UpdateToolDataService;

let user: User;
let tags: Tag[];
let tool: Tool;

describe('UpdateToolDataService', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeTagsRepository = new FakeTagsRepository();
    fakeToolsRepository = new FakeToolsRepository();

    updateToolDataService = new UpdateToolDataService(
      fakeUsersRepository,
      fakeToolsRepository,
      fakeTagsRepository,
    );

    user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    tags = await fakeTagsRepository.create([
      'NodeJS',
      'Express',
      'Rate Limiter',
    ]);

    tool = await fakeToolsRepository.create({
      user_id: user.id,
      title: 'Test Tool',
      description: 'Simple test',
      link: 'simple.test.com',
      tags,
    });
  });

  it('should be able to update an existing tool', async () => {
    const updatedTool = await updateToolDataService.execute({
      tool_id: tool.id,
      user_id: user.id,
      title: 'Updated title',
      description: 'Updated description',
      link: 'http://localhost:3333',
      tags: ['Another Tag'],
    });

    expect(updatedTool.title).toBe('Updated title');
  });

  it('should not be able to update a tool with invalid user_id', async () => {
    await expect(
      updateToolDataService.execute({
        tool_id: tool.id,
        user_id: 'invalid-id',
        title: 'Updated title',
        description: 'Updated description',
        link: 'http://localhost:3333',
        tags: ['Another Tag'],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a tool with invalid tool_id', async () => {
    await expect(
      updateToolDataService.execute({
        tool_id: 'invalid-id',
        user_id: user.id,
        title: 'Updated title',
        description: 'Updated description',
        link: 'http://localhost:3333',
        tags: ['Another Tag'],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a tool that belongs to other user', async () => {
    const anotherUser = await fakeUsersRepository.create({
      name: 'John Fake Doe',
      email: 'johnfakedoe@example.com',
      password: '123456',
    });

    await expect(
      updateToolDataService.execute({
        tool_id: tool.id,
        user_id: anotherUser.id,
        title: 'Updated title',
        description: 'Updated description',
        link: 'http://localhost:3333',
        tags: ['Another Tag'],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update a tool without create new tags', async () => {
    const updatedTool = await updateToolDataService.execute({
      tool_id: tool.id,
      user_id: user.id,
      title: 'Updated title',
      description: 'Updated description',
      link: 'http://localhost:3333',
      tags: ['NodeJS'],
    });

    expect(updatedTool.tags[0].name).toBe('NodeJS');
  });

  it('should be able to update a tool creating some but not all tags', async () => {
    const updatedTool = await updateToolDataService.execute({
      tool_id: tool.id,
      user_id: user.id,
      title: 'Updated title',
      description: 'Updated description',
      link: 'http://localhost:3333',
      tags: ['NodeJS', 'Another Tag'],
    });

    expect(updatedTool.tags[1].name).toBe('Another Tag');
  });
});
