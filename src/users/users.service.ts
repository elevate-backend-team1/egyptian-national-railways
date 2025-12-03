import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose'; // أضف Types هنا
import { User, UserDocument, UserStatus } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userData: { email: string; password: string }): Promise<UserDocument> {
    const existingUser = await this.userModel.findOne({ email: userData.email });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const user = new this.userModel({
      ...userData,
      password: hashedPassword,
      status: UserStatus.PENDING_VERIFICATION,
    });
    
    return user.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid user ID');
    }
    return this.userModel.findById(id).exec();
  }

  async update(userId: string, updateData: Partial<User>): Promise<UserDocument> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid user ID');
    }
    return this.userModel.findByIdAndUpdate(
      userId, 
      updateData, 
      { new: true }
    ).exec();
  }

  async verifyEmail(userId: string): Promise<UserDocument> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid user ID');
    }
    return this.userModel.findByIdAndUpdate(
      userId,
      { 
        status: UserStatus.VERIFIED,
        isEmailVerified: true 
      },
      { new: true }
    ).exec();
  }

  async completeProfile(userId: string, profileData: any): Promise<UserDocument> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid user ID');
    }
    return this.userModel.findByIdAndUpdate(
      userId,
      {
        ...profileData,
        status: UserStatus.ACTIVE,
      },
      { new: true }
    ).exec();
  }
}