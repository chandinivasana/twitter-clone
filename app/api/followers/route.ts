import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { mongooseConnect } from '@/lib/mongoose';
import { Follower } from '@/models/Follower';

export async function GET(request: Request) {
  await mongooseConnect();
  const session = await getServerSession(authOptions);
  
  const { searchParams } = new URL(request.url);
  const destination = searchParams.get('destination'); // The user being followed
  const source = session?.user.id; // The user who is following

  const existingFollow = await Follower.findOne({ source, destination });
  return NextResponse.json(existingFollow);
}

export async function POST(request: Request) {
  await mongooseConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { destination } = await request.json();
  const source = session.user.id;

  const existingFollow = await Follower.findOne({ source, destination });

  if (existingFollow) {
    // Unfollow
    await existingFollow.deleteOne();
    return NextResponse.json({ following: false });
  } else {
    // Follow
    await Follower.create({ source, destination });
    return NextResponse.json({ following: true });
  }
}