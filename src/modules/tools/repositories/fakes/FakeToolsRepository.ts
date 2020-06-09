import { uuid } from 'uuidv4';

import ICreateToolDTO from '../../dtos/ICreateToolDTO';

import IToolsRepository from '../IToolsRepository';
import Tool from '../../infra/typeorm/entities/Tool';

export default class FakeToolsRepository implements IToolsRepository {
  constructor(private tools: Tool[] = []) {}

  public async findById(id: string): Promise<Tool | undefined> {
    return this.tools.find(tool => tool.id === id);
  }

  public async findAllByUserId(user_id: string): Promise<Tool[]> {
    return this.tools.filter(tool => tool.user_id === user_id);
  }

  public async create({
    user_id,
    title,
    description,
    tags,
    link,
  }: ICreateToolDTO): Promise<Tool> {
    const newTool = new Tool();

    Object.assign(newTool, {
      id: uuid(),
      user_id,
      title,
      link,
      description,
      tags,
    });

    this.tools.push(newTool);

    return newTool;
  }

  public async save(tool: Tool): Promise<Tool> {
    const findIndex = this.tools.findIndex(
      toolOfArr => toolOfArr.id === tool.id,
    );

    this.tools[findIndex] = tool;

    return tool;
  }

  public async delete(tool: Tool): Promise<Tool> {
    const findIndex = this.tools.findIndex(
      toolOfArr => toolOfArr.id === tool.id,
    );

    this.tools.splice(findIndex, 1);

    return tool;
  }
}
