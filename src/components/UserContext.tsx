'use client'
import React from "react";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import firebaseApp from "@/firebase/config";
import { UserInfo } from "@/types";
import { getUserInfo } from "@/firebase/firestore";

const auth = getAuth(firebaseApp);

interface ContextType {
    userAuth: User | null;
    userInfo: UserInfo | null;
}

export const UserContext = React.createContext<ContextType>({ userAuth: null, userInfo: null });

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [userAuth, setUserAuth] = React.useState<User | null>(null);
    const [userInfo, setUserInfo] = React.useState<UserInfo | null>(null);
    const [loaded, setLoaded] = React.useState<boolean>(false);

    const updateUserInfo = (user: User | null) => {
        if (user === null) {
            setUserInfo(null);
            return;
        }
        getUserInfo(user.uid).then(({ result, error }) => {
            if (error) {
                console.log("Problem getting user info:", error);
            }
            setUserInfo(result);
        });
    }

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            if (u != userAuth) {
                setUserAuth(u || null);
                updateUserInfo(u);
            }
        });
        setLoaded(true);
        return unsubscribe;
    }, [userAuth]);

    return (
        <UserContext.Provider value={{ userAuth, userInfo }}>
            {loaded ? children : <div className="text-center">Loading authentication state...</div>}
        </UserContext.Provider>
    )
}