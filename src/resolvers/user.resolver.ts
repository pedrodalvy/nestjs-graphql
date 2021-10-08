import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import RepoService from '../repo.service';
import { User } from '../db/models/user.entity';
import UserInput from './input/user.input';

@Resolver(() => User)
class UserResolver {
  constructor(private readonly repoService: RepoService) {}

  @Query(() => [User])
  public async users(): Promise<User[]> {
    return this.repoService.userRepo.find();
  }

  @Query(() => User, { nullable: true })
  public async user(@Args('id') id: number): Promise<User> {
    return this.repoService.userRepo.findOne(id);
  }

  @Mutation(() => User)
  public async createOrLoginUser(
    @Args('data') input: UserInput,
  ): Promise<User> {
    const email = input.email.toLocaleLowerCase().trim();

    let user = await this.repoService.userRepo.findOne({
      where: { email },
    });

    if (!user) {
      user = this.repoService.userRepo.create({ email });

      await this.repoService.userRepo.save(user);
    }

    return user;
  }
}

export default UserResolver;
