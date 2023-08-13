import { getUserIdFromName, sendFriendRequest } from "@/firebase/firestore";
import React, { FormEvent } from "react";

export default function FriendRequestForm({ myID }: { myID: string }) {
    const [uname, setUname] = React.useState<string>('');
    const [statusMessage, setStatusMessage] = React.useState<string>();

    const handleForm = (event: FormEvent) => {
        event.preventDefault();
        if (!uname) {
            return;
        }
        getUserIdFromName(uname).then(({ result, error }) => {
            setStatusMessage(`If user ${uname} exists, they will receive your friend request.`);
            if (error) {
                console.log("Got error when trying to get user ID:", error);
                return;
            }
            if (!result) {
                console.log("ID is undefined");
                return;
            }
            console.log(`Sending friend request to ${result}`);
            sendFriendRequest(myID, result).then(({ error }) => {
                if (error) {
                    console.log("Error status is", error);
                }
            });
            setUname('');
        });
    };

    return (
        <div className="max-w-sm">
            <form className="flex flex-col m-1 p-2 space-y-2 items-end" onSubmit={handleForm}>
                <label className="space-x-4">
                    <span>Username</span>
                    <input className="border rounded p-2" value={uname} onChange={(e) => setUname(e.target.value)} required type="text" placeholder="user123" />
                </label>
                <div className="text-right">
                    <button type="submit">Submit</button>
                </div>
            </form>
            {statusMessage ? <div className="m-4">{statusMessage}</div> : null}
        </div>
    );
}