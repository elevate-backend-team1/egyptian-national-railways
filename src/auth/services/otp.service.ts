import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OTP, OTPDocument } from '../schemas/otp.schema';
import * as crypto from 'crypto';

@Injectable()
export class OTPService {
  constructor(@InjectModel(OTP.name) private otpModel: Model<OTPDocument>) {}

  async generateOTP(userId: any): Promise<string> {
    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    
    // Delete any old OTP for same user
    await this.otpModel.deleteMany({ userId });

    // set OTP exp time 10 mins
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Save OTP to database
    await this.otpModel.create({
      userId,
      otp,
      expiresAt,
    });

    return otp;
  }

  async verifyOTP(userId: string, otp: string): Promise<boolean> {
    const otpRecord = await this.otpModel.findOne({
      userId,
      otp,
      expiresAt: { $gt: new Date() },
      verified: false,
    });

    if (!otpRecord) {
      // count faild times
      await this.otpModel.updateOne(
        { userId, otp },
        { $inc: { attempts: 1 } }
      );
      return false;
    }

    // Set OTP to verified
    otpRecord.verified = true;
    await otpRecord.save();

    // Delete OTP after verifing
    await this.otpModel.deleteMany({ userId });

    return true;
  }

  async deleteExpiredOTPs(): Promise<void> {
    await this.otpModel.deleteMany({ expiresAt: { $lt: new Date() } });
  }

  async getOTPRecord(userId: string): Promise<OTPDocument | null> {
    return this.otpModel.findOne({ userId, verified: false }).exec();
  }
}