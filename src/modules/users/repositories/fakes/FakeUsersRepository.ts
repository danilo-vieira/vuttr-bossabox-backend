import { uuid } from 'uuidv4';

import ICreateUserDTO from '../../dtos/ICreateUserDTO';
import IUsersRepository from '../IUsersRepository';

import User from '../../infra/typeorm/entities/User';

export default class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  public async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const newUser = new User();

    Object.assign(newUser, {
      id: uuid(),
      name,
      email,
      password,
    });

    this.users.push(newUser);

    return newUser;
  }

  public async save(user: User): Promise<User> {
    const userIndex = this.users.findIndex(
      userOfArr => userOfArr.id === user.id,
    );

    this.users[userIndex] = user;

    return user;
  }

  public async delete(user: User): Promise<void> {
    const userIndex = this.users.findIndex(
      userOfArr => userOfArr.id === user.id,
    );

    this.users.splice(userIndex, 1);
  }
}
