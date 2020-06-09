import Tag from '../infra/typeorm/entities/Tag';

export default interface ITagsRepository {
  create(names: string[]): Promise<Tag[]>;
  findAllByNames(names: string[]): Promise<Tag[]>;
}
