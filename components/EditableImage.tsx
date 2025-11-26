"use client";

import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { FileDrop } from 'react-file-drop';
import { PulseLoader } from 'react-spinners';
import { useRouter } from 'next/navigation';

type Props = {
  type: 'cover' | 'image';
  src: string;
  className?: string;
  width: number;
  height: number;
};

export default function EditableImage({ type, src, className, width, height }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter(); // To refresh data

  async function uploadImage(files: FileList | null) {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'upload-type': type, // Send the type in headers
        },
      });
      // Refresh the page to show the new image
      router.refresh(); 
    } catch (error) {
      console.error("Upload failed", error);
    }
    
    setIsUploading(false);
  }

  return (
    <FileDrop onDrop={uploadImage}>
      <div className={`relative ${className}`}>
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10">
            <PulseLoader color="#308cd8" size={14} />
          </div>
        )}
        <Image
          src={src}
          alt={`${type} photo`}
          width={width}
          height={height}
          className="object-cover w-full h-full"
        />
      </div>
    </FileDrop>
  );
}