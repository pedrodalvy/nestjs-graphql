import { User } from '../models/user.entity';
import { getRepository } from 'typeorm';
import * as DataLoader from 'dataloader';

type BatchUser = (ids: number[]) => Promise<User[]>;

const batchUsers: BatchUser = async (userId: number[]) => {
  const userRepository = getRepository(User);
  const users = await userRepository.findByIds(userId);

  const userMap: { [userId: number]: User } = {};

  users.forEach((user) => {
    userMap[user.id] = user;
  });

  return userId.map((userId) => userMap[userId]);
};

export const userLoader = () => new DataLoader<number, User>(batchUsers);
