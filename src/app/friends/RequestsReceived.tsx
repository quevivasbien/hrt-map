import { getFriendRequests, getUserInfoBatch, respondToFriendRequest } from "@/firebase/firestore";
import { EMPTY_FRIEND_REQUEST_INFO, FriendRequestInfo } from "@/types";
import React, { useEffect } from "react";

export default function RequestsReceived({ myID, addFriend }: { myID: string | null, addFriend: (other: string) => void }) {
    const [friendRequests, setFriendRequests] = React.useState<FriendRequestInfo | null>(null);
    const [names, setNames] = React.useState<Record<string, string> | null>(null);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    const getRequesterNames = React.useCallback((friendRequests: FriendRequestInfo) => {
        const { requesters } = friendRequests;
        if (requesters.length === 0) {
            setNames({});
            return;
        }
        getUserInfoBatch(requesters).then(({ result, error }) => {
            if (error || !result) {
                console.log("Got error when requesting user information:", error);
                setErrorMessage("Error getting user information for friend requests");
                return;
            }
            if (result.length < requesters.length) {
                console.log("Number of unames found did not match number of request IDs");
                setErrorMessage("Error getting user information for friend requests");
                return;
            }
            console.log("Result:", result);
            const names: Record<string, string> = {};
            for (let i = 0; i < requesters.length; i++) {
                names[requesters[i]] = result[i].name;
            }
            setNames(names);
        });
    }, []);

    const syncFriendRequests = React.useCallback((uid: string) => {
        getFriendRequests(uid).then(({ result, error }) => {
            if (error) {
                console.log("Got error when fetching friend requests:", error);
                setErrorMessage("Error getting list of friend requests");
                return;
            }
            setFriendRequests(result);
            if (result) {
                getRequesterNames(result);
            }
        });
    }, [getRequesterNames]);

    useEffect(() => {
        if (myID === null) {
            return;
        }
        syncFriendRequests(myID);
    }, [myID, syncFriendRequests]);

    if (myID === null) {
        return <div>
            User authentication is not valid.
        </div>;
    }


    const respond = (requester: string, accept: boolean) => {
        console.log(`Responded ${accept} to friend request in component`);
        respondToFriendRequest(myID, requester, accept).then(({ error }) => {
            if (error !== null) {
                console.log("Got error when responding to friend request:", error);
                return;
            }
            if (accept) {
                addFriend(requester);
            }
            const newFriendRequests = friendRequests ?? EMPTY_FRIEND_REQUEST_INFO;
            newFriendRequests.requesters = newFriendRequests.requesters.filter((f) => f !== requester);
            setFriendRequests(newFriendRequests);
        });
    }

    if (!friendRequests) {
        return (
            <div>
                Loading friend requests...
            </div>
        );
    }

    if (friendRequests.requesters.length === 0) {
        return (
            <div>
                No friend requests right now
            </div>
        );
    }

    const requestList = friendRequests.requesters.map((uid) => {
        return <div key={uid} className="flex flex-row items-center justify-between">
             <div className="flex font-bold">{names ? names[uid] : "Loading..."}</div>
             <button className="flex p-2 rounded-lg drop-shadow-lg bg-violet-800 text-white hover:bg-indigo-900 mx-2" onClick={() => respond(uid, true)}>Accept</button>
             <button className="flex p-2 rounded-lg drop-shadow-lg bg-violet-800 text-white hover:bg-indigo-900 mx-2" onClick={() => respond(uid, false)}>Reject</button>
        </div>;
     });

        return (
            <div>
                {errorMessage ? errorMessage : requestList}
            </div>
        );
}