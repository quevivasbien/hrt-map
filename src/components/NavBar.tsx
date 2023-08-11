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
    const logoutButton = <button className="text-violet-900 hover:underline hover:text-indigo-900" onClick={logout}>Logout</button>;

    const desktopVersion = <div className="hidden sm:block sticky top-0 max-w-4xl mx-auto px-8 py-4 drop-shadow-md rounded-b-lg bg-white z-10">
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
    </div>;

    const [mobileMenuOpen, setMobileMenuOpen] = React.useState<boolean>(false);
    const closedSvg = <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>;
    const openSvg = <svg className=" h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>;
    const mobileMenu = <div className="relative">
        <div className="absolute right-0 flex flex-col items-end w-full border rounded p-4 bg-slate-50/90 backdrop-blur-sm space-y-2 text-lg">
            {user ? <Link href="/create">Create post</Link> : null}
            {user ? logoutButton : loginLink}
        </div>
    </div>;

    const mobileVersion = <div className="block sm:hidden sticky top-0">
        <div className="flex flex-row items-top justify-between bg-slate-50 p-4 drop-shadow">
            <Link href="/" className="text-xl font-bold font-serif inline-block">HRT Map</Link>
            <button className="inline-block" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? openSvg : closedSvg}
            </button>
        </div>
        {mobileMenuOpen ? mobileMenu : null}
    </div>;

    return (
        <>
            {desktopVersion}
            {mobileVersion}
        </>
    );
}
