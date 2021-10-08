import { userLoader } from '../db/loaders/users.loader';

export interface IGraphQLContext {
  userLoader: ReturnType<typeof userLoader>;
}
