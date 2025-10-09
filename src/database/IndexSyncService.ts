import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/domain/user';

@Injectable()
export class IndexSyncService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async onModuleInit() {
    if (process.env.NODE_ENV === 'production') {
      await this.userModel.syncIndexes();
      console.log('✅ Mongo indexes synced');
    }
  }
}
