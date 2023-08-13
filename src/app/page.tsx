'use client'

import React from "react";
import { UserContext } from "@/components/UserContext";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { userAuth, userInfo } = React.useContext(UserContext);

  if (userAuth) {
    return (
      <>
        <h1>Welcome, {userInfo?.name ?? userAuth.email}</h1>
        <div className="flex flex-col">
          Links go here
        </div>
      </>
    );
  }

  return (
    <div className="text-center">
      <Link href="/auth/login">Log in</Link> to get started.
    </div>
  );
}
