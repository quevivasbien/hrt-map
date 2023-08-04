'use client'

import React from "react";
import { getRecentEvents } from "@/firebase/firestore";
import type { DocumentData } from 'firebase/firestore';
import DoseEvent from "@/components/DoseEvent";
import { UserContext } from "@/components/UserContext";
import { useRouter } from 'next/navigation';

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
  });

  return (
    <main>
      {loaded ? events?.map((e: DocumentData) => {
        return <DoseEvent key={e.time} time={e.time} loc={e.loc} comment={e.comment} rating={e.rating} />;
      })
      : <div>Loading...</div>}
    </main>
  )
}
