import { model, models, Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  cover?: string;
  bio?: string;
  username?: string;
}

const UserSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  cover: { type: String },
  bio: { type: String },
  username: { type: String, unique: true, sparse: true },
}, { timestamps: true });

export const User = models?.User || model<IUser>('User', UserSchema);