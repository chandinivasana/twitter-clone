"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { IUser } from '@/models/User';
import { useRouter } from 'next/navigation';

export default function useUserInfo() {
  const { data: session, status } = useSession();
  const [userInfo, setUserInfo] = useState<IUser | null>(null);
  const [userInfoStatus, setUserInfoStatus] = useState('loading');
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      setUserInfoStatus('loading');
      return;
    }

    if (status === 'unauthenticated') {
      setUserInfoStatus('unauthenticated');
      return;
    }

    if (session?.user.id) {
      axios.get('/api/users?id=' + session.user.id)
        .then(response => {
          setUserInfo(response.data);
          
          // Check if user has a username, if not, force redirect
          if (!response.data.username) {
            router.push('/profile-setup'); // You'd need to create this page
          }
          
          setUserInfoStatus('authenticated');
        })
        .catch(() => {
          setUserInfoStatus('error');
        });
    }
  }, [status, session, router]);

  return { userInfo, setUserInfo, userInfoStatus: status };
}