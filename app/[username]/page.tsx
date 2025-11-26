import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { mongooseConnect } from '@/lib/mongoose';
import { User, IUser } from '@/models/User';
import { Post, IPost } from '@/models/Post';
import { Follower } from '@/models/Follower';
import Cover from '@/components/Cover';
import Avatar from '@/components/Avatar';
import PostContent from '@/components/PostContent';
import ProfileButtons from '@/components/ProfileButtons'; // We'll create this
import ProfileInfo from '@/components/ProfileInfo';     // We'll create this

async function getProfileData(username: string, loggedInUserId?: string) {
  await mongooseConnect();
  
  const profileUser: IUser | null = await User.findOne({ username }).lean();
  if (!profileUser) return { notFound: true };

  const profileUserId = profileUser._id;

  const posts: IPost[] = await Post.find({ author: profileUserId })
    .populate('author')
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  let isFollowing = false;
  if (loggedInUserId) {
    const follow = await Follower.findOne({
      source: loggedInUserId,
      destination: profileUserId,
    });
    isFollowing = !!follow;
  }

  return {
    profileUser: JSON.parse(JSON.stringify(profileUser)),
    posts: JSON.parse(JSON.stringify(posts)),
    isFollowing,
    isMyProfile: loggedInUserId === profileUserId.toString(),
  };
}

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const session = await getServerSession(authOptions);
  const { username } = params;

  const {
    profileUser,
    posts,
    isFollowing,
    isMyProfile,
    notFound
  } = await getProfileData(username, session?.user.id);

  if (notFound) {
    return <div className="p-4">Profile not found</div>;
  }

  return (
    <div>
      {/* Cover is now a Client Component */}
      <Cover 
        src={profileUser.cover} 
        isMyProfile={isMyProfile} 
      />
      
      <div className="flex justify-between p-4">
        <div className="ml-2 -mt-16">
          {/* Avatar is a Client Component */}
          <Avatar 
            src={profileUser.image} 
            isMyProfile={isMyProfile} 
            big 
          />
        </div>
        {/* ProfileButtons is a Client Component */}
        <ProfileButtons 
          isMyProfile={isMyProfile}
          isFollowing={isFollowing}
          profileId={profileUser._id.toString()}
        />
      </div>

      {/* ProfileInfo is a Client Component */}
      <ProfileInfo 
        isMyProfile={isMyProfile} 
        profileUser={profileUser}
      />

      <div className="mt-4">
        {posts.map(post => (
          <PostContent 
            key={post._id.toString()} 
            post={post}
          />
        ))}
      </div>
    </div>
  );
}