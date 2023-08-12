'use client'

import React from "react";
import { getRecentEvents } from "@/firebase/firestore";
import DoseEvent from "@/components/DoseEvent";
import { UserContext } from "@/components/UserContext";
import { useRouter } from 'next/navigation';
import { DoseInfo } from "@/types";
import { QueryDocumentSnapshot } from "firebase/firestore";

const NUM_RECENT_EVENTS = 3;

export default function Home() {
    const router = useRouter();
    const [events, setEvents] = React.useState<React.JSX.Element[]>([]);
    const [lastSnapshot, setLastSnapshot] = React.useState<QueryDocumentSnapshot | null>(null);
    const [loaded, setLoaded] = React.useState<boolean>(false);
    const { userAuth } = React.useContext(UserContext);

    const eventInfoToJsx = (info: DoseInfo) => {
        return <DoseEvent key={info.time.getMilliseconds()} info={info} />;
    }

    if (userAuth === null) {
        console.log("user is unauthenticated; navigating to login page...");
        router.push("/auth/login");
    }

    React.useEffect(() => {
        if (userAuth === null) {
            return;
        }
        getRecentEvents(userAuth.uid, NUM_RECENT_EVENTS).then(({ events, lastSnapshot }) => {
            setEvents(events.map(eventInfoToJsx));
            setLastSnapshot(lastSnapshot);
            setLoaded(true);
        });
    }, [userAuth, router]);

    const getMoreEvents = () => {
        if (lastSnapshot === null || userAuth === null) {
            return;
        }
        setLoaded(false);
        getRecentEvents(userAuth.uid, NUM_RECENT_EVENTS, lastSnapshot).then((res) => {
            const newEvents = res.events.map(eventInfoToJsx);
            setEvents([...events, ...newEvents]);
            setLastSnapshot(res.lastSnapshot);
            setLoaded(true);
        });
    };

    const eventList = <div className="flex flex-col mx-1 w-full sm:w-3/4 space-y-12">
        {loaded && events.length === 0 ? <div>You haven&apos;t created any posts yet.</div> : null}
        {events}
        {!loaded ? <div>Loading...</div> : null}
        {loaded && lastSnapshot ? <button className="p-2 rounded-lg drop-shadow-lg bg-violet-800 text-white hover:bg-indigo-900 w-1/3 mx-auto" onClick={getMoreEvents}>Show more</button> : null}
    </div>

    return (
        <div className="flex flex-col items-center">
            <h1>Your recent posts</h1>
            {eventList}
        </div>
    )
}
