import AppError from '../../../shared/errors/AppError';

import FakeUsersRepository from '../../users/repositories/fakes/FakeUsersRepository';
import FakeToolsRepository from '../repositories/fakes/FakeToolsRepository';
import FakeTagsRepository from '../../tags/repositories/fakes/FakeTagsRepository';

import CreateToolService from './CreateToolService';

let fakeUsersRepository: FakeUsersRepository;
let fakeToolsRepository: FakeToolsRepository;
let fakeTagsRepository: FakeTagsRepository;

let createTool: CreateToolService;

describe('CreateToolService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeToolsRepository = new FakeToolsRepository();
    fakeTagsRepository = new FakeTagsRepository();

    createTool = new CreateToolService(
      fakeUsersRepository,
      fakeToolsRepository,
      fakeTagsRepository,
    );
  });

  it('should be able to create a new tool', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const tool = await createTool.execute({
      user_id: user.id,
      title: 'Test tool',
      description: 'Just a test',
      link: 'www.google.com',
      tags: ['tag1', 'tag2', 'tag3'],
    });

    expect(tool.title).toBe('Test tool');
    expect(tool).toHaveProperty('id');
  });

  it('should be able to create a new tool with some tags already booked', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await createTool.execute({
      user_id: user.id,
      title: 'Test tool',
      description: 'Just a test',
      link: 'www.google.com',
      tags: ['tag1', 'tag2', 'tag3'],
    });

    const tool = await createTool.execute({
      user_id: user.id,
      title: 'Test tool',
      description: 'Just a test',
      link: 'www.google.com',
      tags: ['tag1', 'tag2', 'tag4'],
    });

    expect(tool).toEqual(
      expect.objectContaining({
        description: 'Just a test',
        id: tool.id,
        link: 'www.google.com',
        tags: [
          { id: tool.tags[0].id, name: 'tag1' },
          { id: tool.tags[1].id, name: 'tag2' },
          { id: tool.tags[2].id, name: 'tag4' },
        ],
        title: 'Test tool',
        user_id: user.id,
      }),
    );
  });

  it('should not be able to create a new tool without an authenticated user', async () => {
    await expect(
      createTool.execute({
        user_id: 'invalid-id',
        title: 'Test tool',
        description: 'Just a test',
        link: 'www.google.com',
        tags: ['tag1', 'tag2', 'tag3'],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
