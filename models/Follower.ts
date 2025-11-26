import { model, models, Schema, Document, Types } from 'mongoose';

export interface IFollower extends Document {
  source: Types.ObjectId; // The user who is following
  destination: Types.ObjectId; // The user who is being followed
}

const FollowerSchema: Schema<IFollower> = new Schema({
  source: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  destination: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export const Follower = models?.Follower || model<IFollower>('Follower', FollowerSchema);