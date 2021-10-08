import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity({ name: 'messages' })
export class Message {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ name: 'author_id' })
  authorId: number;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field(() => User)
  user: User;

  @ManyToOne(() => User, (user) => user.messageConnection, { primary: true })
  @JoinColumn({ name: 'author_id' })
  userConnection: Promise<User>;
}
