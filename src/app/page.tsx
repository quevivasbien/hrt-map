'use client'

import React from "react";
import { UserContext } from "@/components/UserContext";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const user = React.useContext(UserContext);
  
  React.useEffect(() => {
    if (user !== null) {
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
