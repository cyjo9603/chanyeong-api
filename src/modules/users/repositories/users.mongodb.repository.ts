import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, UpdateQuery } from 'mongoose';
import { ObjectId } from 'mongodb';

import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersMongodbRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async find(filter: FilterQuery<UserDocument>) {
    return this.userModel.find(filter).exec();
  }

  async findbyIdAndUpdate(id: ObjectId, update: UpdateQuery<UserDocument>) {
    return this.userModel.findByIdAndUpdate(id, update, { new: true }).exec();
  }
}
