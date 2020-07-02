import AppError from '../../../shared/errors/AppError';

import FakeUsersRepository from '../../users/repositories/fakes/FakeUsersRepository';
import FakeToolsRepository from '../repositories/fakes/FakeToolsRepository';
import FakeTagsRepository from '../../tags/repositories/fakes/FakeTagsRepository';

import ShowByTagNameService from './ShowByTagNameService';

let fakeUsersRepository: FakeUsersRepository;
let fakeToolsRepository: FakeToolsRepository;
let fakeTagsRepository: FakeTagsRepository;

let showByTagName: ShowByTagNameService;

describe('ShowByTagNameService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeToolsRepository = new FakeToolsRepository();
    fakeTagsRepository = new FakeTagsRepository();

    showByTagName = new ShowByTagNameService(
      fakeUsersRepository,
      fakeToolsRepository,
    );
  });

  it('should be able to list all tools by tag name', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const [tag] = await fakeTagsRepository.create(['tag1']);

    const createdTool = await fakeToolsRepository.create({
      user_id: user.id,
      title: 'Title',
      description: 'Descriptionnnnnnnnnnnn',
      link: 'https://www.google.com',
      tags: [tag],
    });

    const tools = await showByTagName.execute({
      user_id: user.id,
      tag_name: 'tag1',
    });

    expect(tools[0].id).toBe(createdTool.id);
  });

  it('should not be able to list all tools by tag name without an authenticated user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const [tag] = await fakeTagsRepository.create(['tag1']);

    await fakeToolsRepository.create({
      user_id: user.id,
      title: 'Title',
      description: 'Descriptionnnnnnnnnnnn',
      link: 'https://www.google.com',
      tags: [tag],
    });

    await expect(
      showByTagName.execute({
        user_id: 'unauthenticated-user',
        tag_name: 'tag1',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to list all tools from user without tags', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const [tag] = await fakeTagsRepository.create(['tag1']);

    const createdTool = await fakeToolsRepository.create({
      user_id: user.id,
      title: 'Title',
      description: 'Descriptionnnnnnnnnnnn',
      link: 'https://www.google.com',
      tags: [tag],
    });

    const tools = await showByTagName.execute({
      user_id: user.id,
      tag_name: undefined,
    });

    expect(tools[0].id).toBe(createdTool.id);
  });
});
