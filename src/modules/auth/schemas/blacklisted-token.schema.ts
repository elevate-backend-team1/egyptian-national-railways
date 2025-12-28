import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class BlacklistedToken extends Document {
  @Prop({ required: true, unique: true, index: true })
  jti: string;

  @Prop({ required: true })
  expiresAt: Date;
}

export const BlacklistedTokenSchema = SchemaFactory.createForClass(BlacklistedToken);

// Auto clean expired tokens
BlacklistedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// register the schema
export const BlacklistedTokenModel = MongooseModule.forFeature([
  { name: BlacklistedToken.name, schema: BlacklistedTokenSchema }
]);
