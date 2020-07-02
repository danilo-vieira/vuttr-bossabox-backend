import Tool from '../infra/typeorm/entities/Tool';

export interface IResponse {
  user_id: string;
  id: string;
  title: string;
  link: string;
  description: string;
  tags: string[];
  created_at: Date;
  updated_at: Date;
}

export default function parseToolWithOnlyTagName(tool: Tool): IResponse {
  return {
    ...tool,
    tags: tool.tags.map(tag => tag.name),
  };
}
