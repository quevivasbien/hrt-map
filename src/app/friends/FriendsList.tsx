import { getUserInfoBatch } from "@/firebase/firestore";
import { UserInfo } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";

function FriendPreview({ uid, info }: { uid: string, info: UserInfo}) {
    return (
        <div className="flex flex-row m-4 items-center justify-between">
            <div className="text-lg font-bold">{info.name}</div>
            <div><Link href={`/recent/${uid}`}>See recent posts</Link></div>
        </div>
    );
}

export default function FriendsList({ friends }: { friends: string[] }) {
    const [friendsUserInfo, setFriendsUserInfo] = useState<UserInfo[]>();
    const [errorMessage, setErrorMessage] = useState<string>();

    useEffect(() => {
        if (friends.length === 0) {
            return;
        }
        getUserInfoBatch(friends).then(({ result, error }) => {
            if (error) {
                console.log("Got error when fetching friends' user info:", error);
            } else if (!result) {
                console.log("Got no error, but result is missing.");
            } else if (result.length !== friends.length) {
                console.log("Result length does not match input length");
            }
            if (error || !result || result.length !== friends.length) {
                setErrorMessage("Something went wrong while fetching your friends' info");
                return;
            }
            setFriendsUserInfo(result);
        });
    }, [friends]);

    if (friends.length === 0) {
        return (
            <div>No friends yet</div>
        );
    }

    if (!friendsUserInfo) {
        return (
            <div>Loading friends&apos; info</div>
        );
    }

    if (errorMessage) {
        return (
            <div className="text-red-700">{errorMessage}</div>
        );
    }

    const friendPreviews = [];
    for (let i = 0; i < friends.length; i++) {
        if (!friends[i] || !friendsUserInfo[i]) {
            console.log("friends and friends info don't match:", { friends, friendsUserInfo });
            continue;
        }
        friendPreviews.push(
            <FriendPreview key={friends[i]} uid={friends[i]} info={friendsUserInfo[i]} />
        );
    }
    return (
        <div className="flex flex-col">
            {friendPreviews}
        </div>
    );
}