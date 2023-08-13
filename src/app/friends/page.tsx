'use client'
import { UserContext } from "@/components/UserContext";
import { EMPTY_FRIEND_INFO, FriendInfo } from "@/types";
import React from "react";
import { getFriendInfo, checkSentFriendRequests } from "@/firebase/firestore";
import RequestsReceived from "./RequestsReceived";
import FriendRequestForm from "./FriendRequestForm";
import FriendsList from "./FriendsList";
import RequireAuth from "@/components/RequireAuth";

export default function FriendsPage() {
    const { userAuth } = React.useContext(UserContext);
    const [friendInfo, setFriendInfo] = React.useState<FriendInfo | null>(null);
    const [errorMessage, setErrorMessage] = React.useState<string>('');

    const syncSentFriendRequests = React.useCallback((uid: string, friendInfo: FriendInfo | null) => {
        if (friendInfo && friendInfo.requestsSent.length > 0) {
            checkSentFriendRequests(uid, friendInfo).then(({ result, error }) => {
                if (error) {
                    console.log("Got error when updating sent friend requests:", error);
                    setErrorMessage("Something went wrong when updating friend requests.");
                    return;
                }
                setFriendInfo(result);
            });
        }
    }, []);

    const syncFriendInfo = React.useCallback((uid: string) => {
        getFriendInfo(uid).then(({ result, error }) => {
            if (error) {
                console.log("Got error when fetching friend info:", error);
                setErrorMessage("Something went wrong when fetching friend info.");
                return;
            }
            setFriendInfo(result);
            syncSentFriendRequests(uid, result);
        });
    }, [syncSentFriendRequests]);

    React.useEffect(() => {
        if (userAuth === null) {
            console.log("Tried to get friend info without being logged in");
            return;
        }
        syncFriendInfo(userAuth.uid);
    }, [userAuth, syncFriendInfo]);

    const addFriend = (other: string) => {
        const newFriendInfo = friendInfo ? {...friendInfo} : EMPTY_FRIEND_INFO;
        newFriendInfo.friends.push(other);
        setFriendInfo(newFriendInfo);
    };

    let body: React.ReactNode;

    if (!friendInfo) {
        body = (
            <div>
                Loading friend info...
            </div>
        );
    } else if (errorMessage) {
        body = <div>{errorMessage}</div>;
    } else {
        body = (
            <div className="flex flex-col space-y-8">
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 justify-between">
                    <div>
                        <h2>Friend requests</h2>
                        <div className="mx-2">
                            <RequestsReceived myID={userAuth?.uid ?? null} addFriend={addFriend} />
                        </div>
                    </div>
                    <div>
                        <h2>Send a friend request</h2>
                        <FriendRequestForm myID={userAuth?.uid ?? ''} />
                    </div>
                </div>
                <div>
                    <h2>Your friends</h2>
                    <FriendsList friends={friendInfo.friends} />
                </div>
            </div>
        );
    }

    return (
        <RequireAuth>
            {body}
        </RequireAuth>
    );
}
