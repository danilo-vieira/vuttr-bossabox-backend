import { Repository, getRepository } from 'typeorm';

import IUsersRepository from '../../../repositories/IUsersRepository';
import User from '../entities/User';
import ICreateUserDTO from '../../../dtos/ICreateUserDTO';

export default class UsersRepository implements IUsersRepository {
  private ormRespository: Repository<User>;

  constructor() {
    this.ormRespository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    return this.ormRespository.findOne(id);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.ormRespository.findOne({
      where: { email },
    });
  }

  public async create({
    name,
    password,
    email,
  }: ICreateUserDTO): Promise<User> {
    const user = this.ormRespository.create({
      name,
      password,
      email,
    });

    return this.ormRespository.save(user);
  }

  public async save(user: User): Promise<User> {
    return this.ormRespository.save(user);
  }

  public async delete(user: User): Promise<User> {
    return this.ormRespository.remove(user);
  }
}
