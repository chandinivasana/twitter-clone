"use client";

import Link from 'next/link';
import Avatar from './Avatar';
import PostButtons from './PostButtons';
import { IPost } from '@/models/Post';
// @ts-ignore
import TimeAgo from 'react-timeago';
// @ts-ignore
import enStrings from 'javascript-time-ago/locale/en';
// @ts-ignore
import TimeAgoLive from 'javascript-time-ago';
import Image from 'next/image';

TimeAgoLive.addDefaultLocale(enStrings);

type Props = {
  post: IPost;
  big?: boolean;
};

export default function PostContent({ post, big }: Props) {
  // If the post or author is missing (e.g., deleted), don't render
  if (!post || !post.author) {
    return (
      <div className="p-4 border-b border-twitterBorder">
        This post is unavailable.
      </div>
    );
  }
  
  // Ensure author is populated
  const author = post.author as any; // Cast to access populated fields

  return (
    <div className="p-4 border-b border-twitterBorder">
      <div className="flex gap-4">
        <Link href={`/${author.username}`}>
          <Avatar src={author.image} />
        </Link>
        <div className="w-full">
          <div className="flex gap-1">
            <Link href={`/${author.username}`} className="font-bold hover:underline">
              {author.name}
            </Link>
            <span className="text-twitterLightGray">
              @{author.username}
            </span>
            <span className="text-twitterLightGray">·</span>
            <span className="text-twitterLightGray">
              <TimeAgo date={post.createdAt} />
            </span>
          </div>

          <Link href={`/${author.username}/status/${post._id}`} className="block mt-1">
            <p className={big ? 'text-2xl' : ''}>{post.text}</p>
            {post.images && post.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {post.images.map(imgSrc => (
                  <div key={imgSrc} className="w-full md:w-[calc(50%-4px)] aspect-video relative rounded-md overflow-hidden">
                    <Image src={imgSrc} alt="post image" layout="fill" className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </Link>

          <PostButtons postId={post._id.toString()} likesCount={post.likesCount} commentsCount={post.commentsCount} />
        </div>
      </div>
    </div>
  );
}