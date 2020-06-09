import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { Exclude } from 'class-transformer';
import Tool from '../../../../tools/infra/typeorm/entities/Tool';

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column('uuid', { nullable: true })
  tool_id: string;

  @OneToMany(() => Tool, tool => tool.user)
  @JoinColumn({ name: 'tool_id' })
  tools: Tool[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
