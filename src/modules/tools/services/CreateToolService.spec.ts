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
});
