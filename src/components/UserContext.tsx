'use client'
import React from "react";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import firebaseApp from "@/firebase/config";

const auth = getAuth(firebaseApp);

export const UserContext = React.createContext<User | null>(null);

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = React.useState<User | null>(null);
    const [loaded, setLoaded] = React.useState<boolean>(false);

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            if (u != user) {
                setUser(u || null);
            }
        });
        setLoaded(true);
        return unsubscribe;
    }, [user]);

    return (
        <UserContext.Provider value={user}>
            {loaded ? children : <div className="text-center">Loading authentication state...</div>}
        </UserContext.Provider>
    )
}