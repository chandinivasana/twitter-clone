"use client";

import { FileDrop } from "react-file-drop";
import { useState } from "react";

type Props = {
  children: (isUploading: boolean) => React.ReactNode;
  onUpload: (src: string) => void;
};

export default function Upload({ children, onUpload }: Props) {
  const [isUploading, setIsUploading] = useState(false);

  async function uploadImage(files: FileList | null) {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'upload-type': 'post', // This is a post attachment
        }
      });
      const data = await res.json();
      onUpload(data.src);
    } catch (error) {
      console.error("Upload failed", error);
    }

    setIsUploading(false);
  }

  return (
    <FileDrop onDrop={uploadImage}>
      {children(isUploading)}
    </FileDrop>
  );
}