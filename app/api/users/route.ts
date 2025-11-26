import { NextResponse } from 'next/server';
import { mongooseConnect } from '@/lib/mongoose';
import { User } from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request: Request) {
  await mongooseConnect();
  
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const username = searchParams.get('username');

  if (id) {
    const user = await User.findById(id);
    return NextResponse.json(user);
  }

  if (username) {
    const user = await User.findOne({ username });
    return NextResponse.json(user);
  }

  return NextResponse.json({ error: 'User not found' }, { status: 404 });
}

export async function PUT(request: Request) {
  await mongooseConnect();
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const data = await request.json();
  const updatedUser = await User.findByIdAndUpdate(session.user.id, data, { new: true });
  
  return NextResponse.json(updatedUser);
}