'use client'

import React from "react";
import { UserContext } from "@/components/UserContext";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { userAuth } = React.useContext(UserContext);
  
  React.useEffect(() => {
    if (userAuth !== null) {
      router.push("/recent");
      return;
    }
  });

  return (
    <main>
      <div className="text-center">
        <Link href="/auth/login">Log in</Link> to get started.
        </div>
    </main>
  )
}
