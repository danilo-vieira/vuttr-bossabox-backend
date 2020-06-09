import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ShowByTagNameService from '../../../services/ShowByTagNameService';
import CreateToolService from '../../../services/CreateToolService';
import UpdateToolDataService from '../../../services/UpdateToolDataService';
import DeleteToolService from '../../../services/DeleteToolService';

import parseToolWithOnlyTagName from '../../../utils/parseToolWithOnlyTagName';

export default class ToolsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { tag } = request.query;

    const showByTagName = container.resolve(ShowByTagNameService);

    const tools = await showByTagName.execute({
      user_id,
      tag_name: tag?.toString(),
    });

    return response.json(tools);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { title, link, description, tags } = request.body;

    const createTool = container.resolve(CreateToolService);

    const createdTool = await createTool.execute({
      user_id,
      title,
      link,
      description,
      tags,
    });

    const parsedTool = parseToolWithOnlyTagName(createdTool);

    return response.status(201).json(parsedTool);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { id } = request.params;
    const { title, link, description, tags } = request.body;

    const updateToolData = container.resolve(UpdateToolDataService);

    const editedTool = await updateToolData.execute({
      user_id,
      tool_id: id,
      title,
      link,
      description,
      tags,
    });

    const parsedTool = parseToolWithOnlyTagName(editedTool);

    return response.json(parsedTool);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { id } = request.params;

    const deleteTool = container.resolve(DeleteToolService);

    await deleteTool.execute({
      user_id,
      tool_id: id,
    });

    return response.status(204).send();
  }
}
