"use client";

import Link from "next/link";
import { useRouter } from 'next/navigation';

type Props = {
  title: string;
};

export default function TopNavLink({ title }: Props) {
  const router = useRouter();
  
  return (
    <div className="flex gap-4 items-center p-4">
      <button onClick={() => router.back()} className="hover:bg-twitterBorder p-2 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
      </button>
      <h1 className="text-lg font-bold">{title}</h1>
    </div>
  );
}