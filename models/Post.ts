import { model, models, Schema, Document, Types } from 'mongoose';
import { IUser } from './User';

export interface IPost extends Document {
  author: Types.ObjectId | IUser;
  text: string;
  images?: string[];
  likesCount: number;
  commentsCount: number;
  parent?: Types.ObjectId | IPost;
}

const PostSchema: Schema<IPost> = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  images: { type: [String] },
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  parent: { type: Schema.Types.ObjectId, ref: 'Post' },
}, { timestamps: true });

export const Post = models?.Post || model<IPost>('Post', PostSchema);