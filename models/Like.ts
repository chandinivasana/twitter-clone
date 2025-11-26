import { model, models, Schema, Document, Types } from 'mongoose';

export interface ILike extends Document {
  author: Types.ObjectId;
  post: Types.ObjectId;
}

const LikeSchema: Schema<ILike> = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
}, { timestamps: true });

export const Like = models?.Like || model<ILike>('Like', LikeSchema);