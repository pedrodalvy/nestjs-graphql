import { Injectable } from '@nestjs/common';
import RepoService from './repo.service';

@Injectable()
export class AppService {
  constructor(private readonly repoService: RepoService) {}

  async getHello(): Promise<string> {
    const totalMessages = await this.repoService.bookRepo.count();

    return `Total messages are ${totalMessages}`;
  }
}
