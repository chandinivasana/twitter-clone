import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { mongooseConnect } from "@/lib/mongoose";
import { Post } from "@/models/Post";
import { Follower } from "@/models/Follower";
import PostForm from "@/components/PostForm";
import PostContent from "@/components/PostContent";
import { IPost } from "@/models/Post";

// Re-usable data fetching function
async function getPosts(userId: string) {
  await mongooseConnect();
  
  const myFollows = await Follower.find({ source: userId }).exec();
  const followedUserIds = myFollows.map(f => f.destination);

  const posts = await Post.find({
    author: [...followedUserIds, userId],
    parent: null,
  })
    .populate('author')
    .limit(20)
    .sort({ createdAt: -1 })
    .exec();

  return posts;
}

export default async function Home() {
  const session = await getServerSession(authOptions);

  // If no session, show a simple message
  if (!session) {
    return (
      <div className="p-4">
        You must be logged in to see the feed.
      </div>
    )
  }

  const posts: IPost[] = await getPosts(session.user.id);

  return (
    <div>
      <h1 className="text-lg font-bold p-4">Home</h1>
      {/* PostForm is a Client Component */}
      <PostForm />
      <div>
        {posts.map(post => (
          <PostContent 
            key={post._id.toString()}
            post={JSON.parse(JSON.stringify(post))}
          />
        ))}
      </div>
    </div>
  );
}