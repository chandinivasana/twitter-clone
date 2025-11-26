import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { mongooseConnect } from '@/lib/mongoose';
import { Like } from '@/models/Like';
import { Post } from '@/models/Post';

export async function POST(request: Request) {
  await mongooseConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { postId } = await request.json();
  const userId = session.user.id;

  const existingLike = await Like.findOne({ author: userId, post: postId });

  if (existingLike) {
    // Unlike
    await existingLike.deleteOne();
    await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });
    return NextResponse.json({ liked: false });
  } else {
    // Like
    await Like.create({ author: userId, post: postId });
    await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });
    return NextResponse.json({ liked: true });
  }
}