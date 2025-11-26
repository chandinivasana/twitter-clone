"use client";

import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  isMyProfile: boolean;
  isFollowing: boolean;
  profileId: string;
};

export default function ProfileButtons({ isMyProfile, isFollowing, profileId }: Props) {
  const [amIFollowing, setAmIFollowing] = useState(isFollowing);
  const router = useRouter();

  async function toggleFollow() {
    setAmIFollowing(prev => !prev);
    await axios.post('/api/followers', { destination: profileId });
    router.refresh();
  }

  function onEditProfileClick() {
    // This component will live in ProfileInfo, so we communicate via CSS
    // A bit of a hack, but simple.
    document.body.classList.add('editing-profile');
  }

  return (
    <div>
      {isMyProfile && (
        <button 
          onClick={onEditProfileClick}
          className="bg-twitterWhite text-black px-4 py-2 rounded-full font-bold"
        >
          Edit Profile
        </button>
      )}
      {!isMyProfile && (
        <button 
          onClick={toggleFollow}
          className={`${
            amIFollowing 
              ? 'bg-black text-white border border-white' 
              : 'bg-twitterWhite text-black'
          } px-4 py-2 rounded-full font-bold`}
        >
          {amIFollowing ? 'Following' : 'Follow'}
        </button>
      )}
    </div>
  );
}