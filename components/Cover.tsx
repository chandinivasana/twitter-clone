"use client";

import Image from "next/image";
import EditableImage from "./EditableImage";

type Props = {
  src?: string | null;
  isMyProfile?: boolean;
};

export default function Cover({ src, isMyProfile }: Props) {
  const defaultSrc = 'https://via.placeholder.com/1500x500';
  const finalSrc = src || defaultSrc;

  if (isMyProfile) {
    return (
      <EditableImage
        type="cover" // Corresponds to 'cover' field in User model
        src={finalSrc}
        className="h-48"
        width={1500}
        height={500}
      />
    );
  }

  return (
    <div className="h-48 overflow-hidden">
      <Image
        src={finalSrc}
        alt="cover photo"
        width={1500}
        height={500}
        className="object-cover w-full h-full"
      />
    </div>
  );
}