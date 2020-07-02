import AppError from '../../../shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import User from '../infra/typeorm/entities/User';

import DeleteUserAccountService from './DeleteUserAccountService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let user: User;

let deleteUserAccount: DeleteUserAccountService;

describe('DeleteUserAccount', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    deleteUserAccount = new DeleteUserAccountService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });
  });

  it('should be able do delete an user account', async () => {
    const deleteMethod = spyOn(fakeUsersRepository, 'delete');

    await deleteUserAccount.execute({
      user_id: user.id,
      password: user.password,
    });

    expect(deleteMethod).toHaveBeenCalledWith(user);
  });

  it('should not be able do delete a non existing user account', async () => {
    await expect(
      deleteUserAccount.execute({
        user_id: 'invalid-id',
        password: user.password,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able do delete an user account with wrong password', async () => {
    await expect(
      deleteUserAccount.execute({
        user_id: user.id,
        password: 'wrong-pass',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
