import { Repository, getRepository } from 'typeorm';

import ICreateToolDTO from '../../../dtos/ICreateToolDTO';

import IToolsRepository from '../../../repositories/IToolsRepository';

import Tool from '../entities/Tool';

export default class ToolsRepository implements IToolsRepository {
  private ormRepository: Repository<Tool>;

  constructor() {
    this.ormRepository = getRepository(Tool);
  }

  findById(id: string): Promise<Tool | undefined> {
    return this.ormRepository.findOne(id);
  }

  findAllByUserId(user_id: string): Promise<Tool[]> {
    return this.ormRepository.find({
      where: { user_id },
      relations: ['tags'],
    });
  }

  create({
    user_id,
    title,
    link,
    description,
    tags,
  }: ICreateToolDTO): Promise<Tool> {
    const tool = this.ormRepository.create({
      user_id,
      title,
      link,
      description,
      tags,
    });

    return this.ormRepository.save(tool);
  }

  save(tool: Tool): Promise<Tool> {
    return this.ormRepository.save(tool);
  }

  delete(tool: Tool): Promise<Tool> {
    return this.ormRepository.remove(tool);
  }
}
