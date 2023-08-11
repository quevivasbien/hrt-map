'use client'

import React from "react";
import { getRecentEvents } from "@/firebase/firestore";
import type { DocumentData } from 'firebase/firestore';
import DoseEvent from "@/components/DoseEvent";
import { UserContext } from "@/components/UserContext";
import { useRouter } from 'next/navigation';
import { DoseInfo } from "@/types";

const NUM_RECENT_EVENTS = 3;

export default function Home() {
    const router = useRouter();
    const [events, setEvents] = React.useState<DocumentData | null>(null);
    const [loaded, setLoaded] = React.useState<boolean>(false);
    const user = React.useContext(UserContext);

    React.useEffect(() => {
        if (user === null) {
            console.log("User is unauthenticated; navigating to login page...");
            router.push("/auth/login");
            return;
        }
        getRecentEvents(user, NUM_RECENT_EVENTS).then((events) => {
            setEvents(events);
            setLoaded(true);
        });
    }, [user, router]);

    return (
        <div className="flex flex-col items-center">
            <h1>Your recent events</h1>
            <div className="flex flex-col mx-1 w-full sm:w-3/4 space-y-12">
                {loaded ? events?.map((info: DoseInfo) => {
                    return <DoseEvent key={info.time.getMilliseconds()} info={info} />;
                })
                    : <div>Loading...</div>}
            </div>
        </div>
    )
}
