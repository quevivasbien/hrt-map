"use client"

import React from "react";
import { getRecentEvents } from "@/firebase/doseEvents";
import DoseEvent from "@/components/DoseEvent";
import { DoseInfo } from "@/types";
import { QueryDocumentSnapshot } from "firebase/firestore";

const NUM_RECENT_EVENTS = 3;

export default function RecentPosts({ uid, isYou = false }: { uid: string, isYou?: boolean }) {
    const [events, setEvents] = React.useState<React.JSX.Element[]>([]);
    const [lastSnapshot, setLastSnapshot] = React.useState<QueryDocumentSnapshot | null>(null);
    const [loaded, setLoaded] = React.useState<boolean>(false);

    React.useEffect(() => {
        getRecentEvents(uid, NUM_RECENT_EVENTS).then(({ events, lastSnapshot }) => {
            setEvents(events.map(eventInfoToJsx));
            setLastSnapshot(lastSnapshot);
            setLoaded(true);
        });
    }, [uid]);

    const eventInfoToJsx = (info: DoseInfo) => {
        return <DoseEvent key={info.time.getMilliseconds()} info={info} />;
    }

    const getMoreEvents = () => {
        if (lastSnapshot === null) {
            return;
        }
        setLoaded(false);
        getRecentEvents(uid, NUM_RECENT_EVENTS, lastSnapshot).then((res) => {
            const newEvents = res.events.map(eventInfoToJsx);
            setEvents([...events, ...newEvents]);
            setLastSnapshot(res.lastSnapshot);
            setLoaded(true);
        });
    };

    const eventList = <div className="flex flex-col mx-1 w-full sm:w-3/4 space-y-12">
        {loaded && events.length === 0 ? <div className="text-center">{isYou ? 'You haven\'t' : 'This user hasn\'t'} created any posts yet.</div> : null}
        {events}
        {!loaded ? <div>Loading...</div> : null}
        {loaded && lastSnapshot ? <button className="p-2 rounded-lg drop-shadow-lg bg-violet-800 text-white hover:bg-indigo-900 w-1/3 mx-auto" onClick={getMoreEvents}>Show more</button> : null}
    </div>

    return (
        <div className="flex flex-col items-center">
            {eventList}
        </div>
    )
}
