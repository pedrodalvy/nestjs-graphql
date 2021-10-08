import { User } from '../models/user.entity';
import { getRepository } from 'typeorm';
import * as DataLoader from 'dataloader';

type BatchUser = (ids: number[]) => Promise<User[]>;

const batchUsers: BatchUser = async (ids: number[]) => {
  const userRepository = getRepository(User);
  const users = await userRepository.findByIds(ids);

  const userMap: { [key: string]: User } = {};
  users.forEach((user) => {
    userMap[user.id] = user;
  });

  return ids.map((id) => userMap[id]);
};

export const userLoader = () => new DataLoader<number, User>(batchUsers);
