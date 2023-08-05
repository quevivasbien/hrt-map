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
  const [shouldRequest, setShouldRequest] = React.useState<boolean>(true);
  const user = React.useContext(UserContext);
  
  React.useEffect(() => {
    if (user === null) {
      console.log("User is unauthenticated; navigating to login page...");
      router.push("/auth/login");
      return;
    }
    if (shouldRequest) {
        getRecentEvents(user, NUM_RECENT_EVENTS).then((events) => {
          setEvents(events);
          setLoaded(true);
        });
        setShouldRequest(false);
    }
    console.log("called useEffect");
  });

  return (
    <main>
      {loaded ? events?.map((info: DoseInfo) => {
        return <DoseEvent key={info.time.getMilliseconds()} info={info} />;
      })
      : <div>Loading...</div>}
    </main>
  )
}
