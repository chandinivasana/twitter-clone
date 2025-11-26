import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { mongooseConnect } from '@/lib/mongoose';
import { Post } from '@/models/Post';
import { User } from '@/models/User';
import { Follower } from '@/models/Follower';

export async function GET(request: Request) {
  await mongooseConnect();
  const session = await getServerSession(authOptions);

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const authorUsername = searchParams.get('author');
  const parent = searchParams.get('parent');

  // Fetch a single post by ID
  if (id) {
    const post = await Post.findById(id)
      .populate('author')
      .populate({
        path: 'parent',
        populate: 'author',
      });
    return NextResponse.json(post);
  }

  // Fetch posts by a specific author
  if (authorUsername) {
    const user = await User.findOne({ username: authorUsername });
    const posts = await Post.find({ author: user._id })
      .populate('author')
      .populate({
        path: 'parent',
        populate: 'author',
      })
      .sort({ createdAt: -1 });
    return NextResponse.json(posts);
  }

  // Fetch replies to a parent post
  if (parent) {
    const posts = await Post.find({ parent })
      .populate('author')
      .sort({ createdAt: -1 });
    return NextResponse.json(posts);
  }

  // Fetch homepage feed (user + users they follow)
  const myFollows = await Follower.find({ source: session?.user.id }).exec();
  const followedUserIds = myFollows.map(f => f.destination);
  
  const posts = await Post.find({
    author: [...followedUserIds, session?.user.id],
    parent: null,
  })
    .populate('author')
    .limit(20)
    .sort({ createdAt: -1 });

  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  await mongooseConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();

  const newPost = await Post.create({
    author: session.user.id,
    text: data.text,
    images: data.images,
    parent: data.parent || null,
  });

  if (newPost.parent) {
    await Post.findByIdAndUpdate(newPost.parent, {
      $inc: { commentsCount: 1 },
    });
  }

  return NextResponse.json(newPost);
}