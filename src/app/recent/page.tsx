'use client'

import React from "react";
import { UserContext } from "@/components/UserContext";
import RequireAuth from "@/components/RequireAuth";
import RecentPosts from "@/components/RecentPosts";

export default function UsersRecentPostsPage() {
    const { userAuth } = React.useContext(UserContext);
    return (
        <RequireAuth>
            <h1>Your recent posts</h1>
            {userAuth ? <RecentPosts uid={userAuth.uid} isYou={true} /> : null}
        </RequireAuth>
    );
}
