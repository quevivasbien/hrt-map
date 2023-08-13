'use client'
import React, { useContext } from "react";
import { UserContext } from "./UserContext";
import Link from "next/link";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
    const { userAuth } = useContext(UserContext);
    if (userAuth) {
        return <>{children}</>
    } else {
        return <div className="text-center">
            <Link href="/auth/login">Log in</Link> to view this content.
        </div>
    }
}