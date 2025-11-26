"use client";

import { IUser } from "@/models/User";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
  isMyProfile: boolean;
  profileUser: IUser;
};

export default function ProfileInfo({ isMyProfile, profileUser }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profileUser.name);
  const [username, setUsername] = useState(profileUser.username);
  const [bio, setBio] = useState(profileUser.bio);
  const router = useRouter();

  // Listen for the custom event from the button
  if (typeof window !== 'undefined') {
    document.body.addEventListener('editing-profile', () => {
      setIsEditing(true);
      document.body.classList.remove('editing-profile');
    }, { once: true });
  }

  async function saveProfile() {
    await axios.put('/api/profile', { name, username, bio });
    setIsEditing(false);
    router.refresh();
  }

  if (isEditing) {
    return (
      <div className="p-4">
        <div className="flex flex-col gap-2">
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            className="bg-twitterBorder p-2 rounded-md"
            placeholder="Name"
          />
          <input 
            type="text" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            className="bg-twitterBorder p-2 rounded-md"
            placeholder="Username"
          />
          <textarea 
            value={bio} 
            onChange={e => setBio(e.target.value)}
            className="bg-twitterBorder p-2 rounded-md"
            placeholder="Bio"
          />
        </div>
        <div className="flex gap-2 mt-4">
          <button 
            onClick={() => setIsEditing(false)}
            className="bg-twitterWhite text-black px-4 py-2 rounded-full font-bold"
          >
            Cancel
          </button>
          <button 
            onClick={saveProfile}
            className="bg-twitterBlue text-white px-4 py-2 rounded-full font-bold"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{profileUser.name}</h1>
      <h2 className="text-sm text-twitterLightGray">@{profileUser.username}</h2>
      <p className="mt-2">{profileUser.bio}</p>
    </div>
  );
}