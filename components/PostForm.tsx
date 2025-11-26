"use client";

import { useState } from 'react';
import Avatar from './Avatar';
import useUserInfo from '@/hooks/useUserInfo';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Upload from './Upload'; // We'll create this

type Props = {
  parent?: string;
  placeholder?: string;
};

export default function PostForm({ parent, placeholder = "What's happening?!" }: Props) {
  const { userInfo, status } = useUserInfo();
  const [text, setText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const router = useRouter();

  async function handlePostSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (text.length === 0 && images.length === 0) return;

    await axios.post('/api/posts', {
      text,
      images,
      parent,
    });
    
    setText('');
    setImages([]);
    router.refresh(); // Refresh the page to show new post
  }

  function onUpload(src: string) {
    setImages(prev => [...prev, src]);
  }

  if (status === 'loading') {
    return null;
  }

  return (
    <form className="p-4 border-b border-twitterBorder" onSubmit={handlePostSubmit}>
      <div className="flex gap-4">
        <Avatar src={userInfo?.image} />
        <div className="w-full">
          <Upload onUpload={onUpload}>
            {(isUploading) => (
              <div>
                <textarea 
                  value={text}
                  onChange={e => setText(e.target.value)}
                  className="w-full bg-transparent p-2 outline-none" 
                  placeholder={placeholder}
                />
                <div className="flex gap-2 mt-2">
                  {images.map(src => (
                    <img key={src} src={src} alt="" className="w-24 h-24 object-cover rounded-md" />
                  ))}
                  {isUploading && (
                    <div className="w-24 h-24 bg-twitterBorder rounded-md flex items-center justify-center">
                      ...
                    </div>
                  )}
                </div>
              </div>
            )}
          </Upload>

          <div className="text-right mt-2">
            <button
              type="submit"
              className="bg-twitterBlue text-white px-5 py-2 rounded-full font-bold"
            >
              Tweet
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}