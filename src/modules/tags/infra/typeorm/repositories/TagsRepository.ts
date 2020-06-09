import { Repository, getRepository, In } from 'typeorm';

import ITagsRepository from '../../../repositories/ITagsRepository';

import Tag from '../entities/Tag';

export default class TagsRepository implements ITagsRepository {
  private ormRepository: Repository<Tag>;

  constructor() {
    this.ormRepository = getRepository(Tag);
  }

  public async findAllByNames(names: string[]): Promise<Tag[]> {
    return this.ormRepository.find({
      where: {
        name: In(names),
      },
    });
  }

  public async create(names: string[]): Promise<Tag[]> {
    const tags = this.ormRepository.create(names.map(name => ({ name })));

    return this.ormRepository.save(tags);
  }
}
