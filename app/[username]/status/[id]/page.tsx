import { mongooseConnect } from '@/lib/mongoose';
import { Post, IPost } from '@/models/Post';
import PostContent from '@/components/PostContent';
import PostForm from '@/components/PostForm';
import TopNavLink from '@/components/TopNavLink';

async function getPostData(id: string) {
  await mongooseConnect();

  const post: IPost | null = await Post.findById(id)
    .populate('author')
    .populate({
      path: 'parent',
      populate: 'author',
    })
    .lean(); // Use .lean() for plain JS objects

  if (!post) return { notFound: true };

  const replies: IPost[] = await Post.find({ parent: id })
    .populate('author')
    .sort({ createdAt: -1 })
    .lean();

  return {
    post: JSON.parse(JSON.stringify(post)),
    replies: JSON.parse(JSON.stringify(replies)),
  };
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { post, replies, notFound } = await getPostData(id);

  if (notFound) {
    return <div className="p-4">Post not found</div>;
  }

  return (
    <div>
      <TopNavLink title="Post" />
      
      {/* Parent Post, if it's a reply */}
      {post.parent && (
        <PostContent post={post.parent} />
      )}

      {/* Main Post */}
      <PostContent post={post} big />

      {/* Reply Form */}
      <div className="p-4 border-t border-twitterBorder">
        <PostForm 
          placeholder="Tweet your reply"
          parent={id}
        />
      </div>

      {/* Replies */}
      <div className="mt-4">
        {replies.map(reply => (
          <PostContent 
            key={reply._id.toString()} 
            post={reply}
          />
        ))}
      </div>
    </div>
  );
}