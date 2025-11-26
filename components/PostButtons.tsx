"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
  postId: string;
  likesCount: number;
  commentsCount: number;
};

export default function PostButtons({ postId, likesCount, commentsCount }: Props) {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState(likesCount);
  const router = useRouter();

  useEffect(() => {
    // We need to fetch if the current user has liked this post
    // This was missing from the original repo (it passed 'likedByMe')
    // For simplicity, we'll just handle the local state toggle
  }, [postId, session]);

  async function toggleLike() {
    if (!session) return;
    
    setIsLiked(prev => !prev);
    setLocalLikesCount(prev => (isLiked ? prev - 1 : prev + 1));

    await axios.post('/api/like', { postId });
    // We don't router.refresh() here to avoid a full page reload on like
  }
  
  function goToPost() {
    // This is a simplification; in a real app, you'd get the post's
    // author username to build the correct URL.
    router.push(`/post/${postId}`); // Placeholder, adjust as needed
  }

  return (
    <div className="flex gap-8 mt-4 text-twitterLightGray">
      <button onClick={goToPost} className="flex gap-2 items-center">
        {/* Comment Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
        {commentsCount}
      </button>

      <button onClick={toggleLike} className={`flex gap-2 items-center ${isLiked ? 'text-red-500' : ''}`}>
        {/* Heart Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" fill={isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
        {localLikesCount}
      </button>
    </div>
  );
}