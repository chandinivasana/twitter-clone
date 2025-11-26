"use client";

import { getProviders, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

type Provider = {
  id: string;
  name: string;
};

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      // @ts-ignore
      setProviders(res);
    };
    fetchProviders();
  }, []);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (status === "authenticated") {
    router.push("/");
    return null;
  }

  return (
    <div className="flex items-center justify-center h-screen">
      {providers && (
        <div>
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                onClick={() => signIn(provider.id)}
                className="flex items-center gap-3 bg-twitterWhite text-black py-2 px-5 rounded-full"
              >
                <Image src="/google.png" alt="Google icon" width={32} height={32} />
                Sign in with {provider.name}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}