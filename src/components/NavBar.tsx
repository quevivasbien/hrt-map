'use client'
import { logOut } from '@/firebase/auth';
import Link from 'next/link';
import React from 'react';
import { UserContext } from './UserContext';
import { useRouter } from 'next/navigation';

export default function NavBar() {
    const user = React.useContext(UserContext);
    const router = useRouter();

    const logout = async () => {
        const { error } = await logOut();
        if (error) {
            console.log("When logging out, got error:", error);
        }
        router.push("/auth/login");
    };

    const loginLink = <Link href="/auth/login">Login</Link>;
    const logoutButton = <button onClick={logout}>Logout</button>;

    return (
        <div className="sticky top-0 mx-2 sm:max-w-4xl sm:mx-auto px-8 py-4 drop-shadow-md rounded-b-lg bg-white">
            <div className="flex flex-row space-x-4">
                <Link href="/" className="text-xl font-bold font-serif">HRT Map</Link>
                {user ? <Link href="/create">Create post</Link> : null}
                <div className="flex flex-grow justify-end">
                    {user ? <div className="space-x-4">
                        <span>{user.email}</span>
                        {logoutButton}
                    </div> : loginLink}
                </div>
            </div>
        </div>
    );
}
