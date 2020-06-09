import { uuid } from 'uuidv4';

import ITagsRepository from '../ITagsRepository';
import Tag from '../../infra/typeorm/entities/Tag';

export default class FakeTagsRepository implements ITagsRepository {
  constructor(private tags: Tag[] = []) {}

  public async create(names: string[]): Promise<Tag[]> {
    let newTags = names.map(() => new Tag());

    newTags = newTags.map((newTag, index) =>
      Object.assign(newTag, {
        id: uuid(),
        name: names[index],
      }),
    );

    this.tags.push(...newTags);

    return newTags;
  }

  public async findAllByNames(names: string[]): Promise<Tag[]> {
    return this.tags.filter(tag => names.includes(tag.name));
  }
}
