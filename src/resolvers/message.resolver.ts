import RepoService from '../repo.service';
import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { Message } from '../db/models/message.entity';
import { User } from '../db/models/user.entity';
import MessageInput from './input/message.input';
import { PubSub } from 'graphql-subscriptions';
import { context } from '../db/loaders';

const pubSub = new PubSub();

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

    const newMessage = await this.repoService.messageRepo.save(message);

    await pubSub.publish('messageAdded', { messageAdded: message });

    return newMessage;
  }

  @Mutation(() => Message, { nullable: true })
  public async deleteMessage(@Args('id') id: number): Promise<void> {
    const message = await this.repoService.messageRepo.findOneOrFail(id);

    await this.repoService.messageRepo.remove(message);
  }

  @Subscription(() => Message)
  async messageAdded() {
    return pubSub.asyncIterator('messageAdded');
  }

  @ResolveField(() => User, { name: 'user' })
  public async user(
    @Parent() parent: Message,
    @Context() { userLoader }: typeof context,
  ): Promise<User> {
    if (userLoader) {
      return userLoader.load(parent.userId);
    }

    return this.repoService.userRepo.findOne(parent.userId);
  }
}

export default MessageResolver;
