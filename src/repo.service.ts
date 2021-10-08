import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './db/models/user.entity';
import { Message } from './db/models/message.entity';

@Injectable()
class RepoService {
  public constructor(
    @InjectRepository(User) public readonly authorRepo: Repository<User>,
    @InjectRepository(Message) public readonly bookRepo: Repository<Message>,
  ) {}
}

export default RepoService;
