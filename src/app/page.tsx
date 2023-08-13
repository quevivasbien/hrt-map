'use client'

import React from "react";
import { UserContext } from "@/components/UserContext";
import Link from 'next/link';

export default function Home() {
  const { userAuth, userInfo } = React.useContext(UserContext);

  if (userAuth) {
    return (
      <>
        <h1 className="text-center">Welcome, {userInfo?.name ?? userAuth.email}</h1>
        <div className="flex flex-col items-center text-lg space-y-2">
          <Link href="/create">Create a new post</Link>
          <Link href="/recent">View your recent posts</Link>
          <Link href="/friends">View your friends or manage friend requests</Link>
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
