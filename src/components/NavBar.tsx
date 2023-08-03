'use client'
import { logOut } from '@/firebase/auth';
import firebaseApp from '@/firebase/config';
import { onAuthStateChanged, getAuth, type User } from 'firebase/auth';
import Link from 'next/link';
import React from 'react';

const auth = getAuth(firebaseApp);

export default function NavBar() {
    const [user, setUser] = React.useState<User | null>(null);

    onAuthStateChanged(auth, (user) => {
        setUser(user || null);
    });

    const logout = async () => {
        const { error } = await logOut();
        if (error) {
            console.log("When logging out, got error:", error);
        }
    };

    const loginLink = <Link className="text-violet-900 hover:underline hover:text-indigo-900" href="/auth/login">Login</Link>;
    const logoutButton = <button className="text-violet-900 hover:underline hover:text-indigo-900" onClick={logout}>Logout</button>;

    return (
        <div className="sticky top-0 mx-2 sm:max-w-4xl sm:mx-auto px-8 py-4 drop-shadow-md rounded-b-lg bg-white">
            <div className="flex flex-row justify-between">
                <Link href="/" className="text-xl font-bold font-serif text-violet-900 hover:underline hover:text-indigo-900">HRT Map</Link>
                {user ? <div className="space-x-4">
                    <span>{user.email}</span>
                    {logoutButton}
                </div> : loginLink}
            </div>
        </div>
    );
}
