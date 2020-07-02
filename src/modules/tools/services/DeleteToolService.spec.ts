import AppError from '../../../shared/errors/AppError';

import FakeUsersRepository from '../../users/repositories/fakes/FakeUsersRepository';
import FakeToolsRepository from '../repositories/fakes/FakeToolsRepository';

import DeleteToolService from './DeleteToolService';
import FakeTagsRepository from '../../tags/repositories/fakes/FakeTagsRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeToolsRepository: FakeToolsRepository;
let fakeTagsRepository: FakeTagsRepository;

let deleteTool: DeleteToolService;

describe('DeleteToolService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeToolsRepository = new FakeToolsRepository();
    fakeTagsRepository = new FakeTagsRepository();

    deleteTool = new DeleteToolService(
      fakeUsersRepository,
      fakeToolsRepository,
    );
  });

  it('should be able to delete an existing tool', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const [tag] = await fakeTagsRepository.create(['tag1']);

    const tool = await fakeToolsRepository.create({
      user_id: user.id,
      title: 'A new tool',
      description: 'A tool that will be deleted',
      link: 'non-existing-link',
      tags: [tag],
    });

    await deleteTool.execute({
      user_id: user.id,
      tool_id: tool.id,
    });

    const deletedTool = await fakeToolsRepository.findById(tool.id);

    expect(deletedTool).toBe(undefined);
  });

  it('should not be able to delete an existing tool with a non existing user id', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const [tag] = await fakeTagsRepository.create(['tag1']);

    const tool = await fakeToolsRepository.create({
      user_id: user.id,
      title: 'A new tool',
      description: 'A tool that will be deleted',
      link: 'non-existing-link',
      tags: [tag],
    });

    await expect(
      deleteTool.execute({
        user_id: 'non-existing-user-id',
        tool_id: tool.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete a non existing tool', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      deleteTool.execute({
        user_id: user.id,
        tool_id: 'non-existing-tool-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete a tool of another user', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: '123456',
    });

    const [tag] = await fakeTagsRepository.create(['tag1']);

    const tool = await fakeToolsRepository.create({
      user_id: user1.id,
      title: 'A new tool',
      description: 'A tool that will be deleted',
      link: 'non-existing-link',
      tags: [tag],
    });

    await expect(
      deleteTool.execute({
        user_id: user2.id,
        tool_id: tool.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
