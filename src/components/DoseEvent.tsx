import { DoseInfo, Reaction, UserInfo } from "@/types"
import MapDisplay from "./MapDisplay"
import StaticRating from "./StaticRating"
import { FormEvent, useContext, useEffect, useState } from "react";
import { getUserInfoBatch } from "@/firebase/firestore";
import { getReactions, addReaction } from "@/firebase/doseEvents";
import { UserContext } from "./UserContext";

const MAX_REACTION = 40;

function AddReaction({ doseID, reactions, setReactions }: { doseID: string, reactions: Reaction[], setReactions: (r: Reaction[]) => void }) {
    const { userAuth } = useContext(UserContext);
    const [reaction, setReaction] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!userAuth || !reaction) {
            return;
        }
        const r = { user: userAuth.uid, text: reaction };
        setReaction('');
        addReaction(doseID, r).then(({ error }) => {
            if (error) {
                console.log("Error adding reaction:", error);
                return;
            }
            setReactions([...reactions, r]);
        });
    };

    if (!userAuth) {
        return null;
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-row space-x-4">
            <input type="text" className="border rounded p-2" placeholder="Add a reaction" required value={reaction} onChange={(e) => setReaction(e.target.value)} maxLength={MAX_REACTION} />
            <button type="submit" disabled={!reaction}>Submit</button>
        </form>
    );
}

function Reactions({ reactions }: { reactions: Reaction[] }) {
    const [userInfo, setUserInfo] = useState<Record<string, UserInfo>>();
    const [errorMessage, setErrorMessage] = useState<string>();
    useEffect(() => {
        if (reactions.length === 0) {
            return;
        }
        const users = reactions.map((r) => r.user);
        getUserInfoBatch(users).then(({ result, error }) => {
            if (error || !result) {
                console.log("Got error when getting user info:", error);
                setErrorMessage("Problem loading reactions :(");
                return;
            }
            setUserInfo(result);
        });
    }, [reactions]);


    if (reactions.length === 0) {
        return null;
    }
    if (errorMessage) {
        return (
            <div>{errorMessage}</div>
        );
    }
    if (!userInfo) {
        return (
            <div>Loading...</div>
        );
    }

    const reactionDivs = reactions.map((r) => {
        return <div key={r.user + (Math.random() * 100).toString()} className="flex flex-row space-x-4">
            <div className="font-bold">{userInfo[r.user].name}</div>
            <div>{r.text}</div>
        </div>;
    });
    return (
        <div className="flex flex-col">
            {reactionDivs}
        </div>
    );
}

export default function DoseEvent({ info }: { info: DoseInfo }) {
    const { id, time, pos, comment, rating } = info;
    const [reactions, setReactions] = useState<Reaction[]>();
    useEffect(() => {
        if (!id) {
            console.log("Cannot get reactions without event ID");
            return;
        }
        getReactions(id).then(({ result, error }) => {
            if (error || !result) {
                console.log("Got error when fetching reactions:", error);
                return;
            }
            setReactions(result);
        });
    }, [id]);
    return (
        <div className="flex flex-col space-y-4">
            <div>
                <span className="font-bold">Time</span>: {time.toLocaleString()}
            </div>
            {comment !== "" ? <div>
                <span className="font-bold">Comment</span>: {comment}
            </div> : null}
            {rating !== 0 ? <div className="flex flex-row space-x-4 items-center">
                <span className="font-bold">Rating:</span> <StaticRating rating={rating} />
            </div> : null}
            <MapDisplay pos={pos} />
            {id && reactions ? <>
                <Reactions reactions={reactions} />
                {id ? <AddReaction doseID={id} reactions={reactions} setReactions={setReactions} /> : null}
            </>
                : null
            }

        </div>
    );
}