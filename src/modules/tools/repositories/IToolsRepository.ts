import ICreateToolDTO from '../dtos/ICreateToolDTO';

import Tool from '../infra/typeorm/entities/Tool';

export default interface IToolsRepository {
  findById(id: string): Promise<Tool | undefined>;
  findAllByUserId(user_id: string): Promise<Tool[]>;
  create({ user_id, title, description, tags }: ICreateToolDTO): Promise<Tool>;
  save(tool: Tool): Promise<Tool>;
  delete(tool: Tool): Promise<Tool>;
}
