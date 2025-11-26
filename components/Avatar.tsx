"use client";

import Image from "next/image";
import EditableImage from "./EditableImage";
import { IUser } from "@/models/User";

type Props = {
  src?: string | null;
  big?: boolean;
  isMyProfile?: boolean;
  user?: IUser;
};

export default function Avatar({ src, big, isMyProfile, user }: Props) {
  const width = big ? 120 : 48;
  const defaultSrc = 'https://via.placeholder.com/' + width; // Placeholder
  const finalSrc = src || defaultSrc;

  const containerClasses = `
    rounded-full overflow-hidden 
    ${big ? 'w-32 h-32' : 'w-12 h-12'}
  `;

  if (isMyProfile) {
    return (
      <EditableImage
        type="image" // Corresponds to 'image' field in User model
        src={finalSrc}
        className={containerClasses}
        width={width}
        height={width}
      />
    );
  }

  return (
    <div className={containerClasses}>
      <Image
        src={finalSrc}
        alt="avatar"
        width={width}
        height={width}
        className="object-cover w-full h-full"
      />
    </div>
  );
}