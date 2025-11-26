import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { mongooseConnect } from '@/lib/mongoose';
import { User } from '@/models/User';

// This API is specifically for updating the logged-in user's profile
export async function PUT(request: Request) {
  await mongooseConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();
  
  const updatedUser = await User.findByIdAndUpdate(
    session.user.id,
    {
      name: data.name,
      username: data.username,
      bio: data.bio,
    },
    { new: true }
  );

  return NextResponse.json(updatedUser);
}