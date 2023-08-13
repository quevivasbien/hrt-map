"use client"

import RecentPosts from "@/components/RecentPosts";
import { getUserInfo } from "@/firebase/firestore";
import { UserInfo } from "@/types";
import { useEffect, useState } from "react";

export default function RecentPostsPage({ params }: { params: { slug: string } }) {
    const uid = params.slug;
    const [userInfo, setUserInfo] = useState<UserInfo>();
    const [errorMessage, setErrorMessage] = useState<string>();

    useEffect(() => {
        getUserInfo(uid).then(({ result, error }) => {
            if (error) {
                console.log("Got error when fetching user info:", error);
                setErrorMessage("Something went wrong");
                return;
            }
            if (!result) {
                console.log("Got user info without an error, but info is null");
                setErrorMessage("Something went wrong");
                return;
            }
            setUserInfo(result);
        });
    }, [uid]);

    if (errorMessage) {
        return (
            <div className="text-center text-red-700">{errorMessage}</div>
        );
    }
    if (!userInfo) {
        return <div className="text-center">Loading...</div>
    };

    return (
        <>
            {userInfo ?
                <h1>{userInfo.name}&apos;s recent posts</h1> : null
            }
            <RecentPosts uid={uid} />
        </>
    );
}
