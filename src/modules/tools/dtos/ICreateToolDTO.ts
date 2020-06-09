import Tag from '../../tags/infra/typeorm/entities/Tag';

export default interface ICreateToolDTO {
  user_id: string;
  title: string;
  link: string;
  description: string;
  tags: Tag[];
}
