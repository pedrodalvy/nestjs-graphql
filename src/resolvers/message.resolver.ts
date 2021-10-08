import RepoService from '../repo.service';
import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Message } from '../db/models/message.entity';
import { User } from '../db/models/user.entity';
import MessageInput from './input/message.input';
import { IGraphQLContext } from '../types/graphql.types';

@Resolver(() => Message)
class MessageResolver {
  constructor(private readonly repoService: RepoService) {}

  @Query(() => [Message])
  public async messages(): Promise<Message[]> {
    return this.repoService.messageRepo.find();
  }

  @Query(() => Message, { nullable: true })
  public async message(@Args('id') id: number): Promise<Message> {
    return this.repoService.messageRepo.findOne(id);
  }

  @Query(() => [Message], { nullable: true })
  public async getMessageFromUser(
    @Args('userId') userId: number,
  ): Promise<Message[]> {
    return this.repoService.messageRepo.find({ where: { userId } });
  }

  @Mutation(() => Message)
  public async createMessage(
    @Args('data') input: MessageInput,
  ): Promise<Message> {
    const { content, userId } = input;

    const message = this.repoService.messageRepo.create({ content, userId });

    return this.repoService.messageRepo.save(message);
  }

  @ResolveField(() => User, { name: 'user' })
  public async user(
    @Parent() parent,
    @Context() { userLoader }: IGraphQLContext,
  ): Promise<User> {
    return userLoader.load(parent.userId);
  }
}

export default MessageResolver;
