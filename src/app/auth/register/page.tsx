'use client'
import React, { FormEvent } from "react";
import { useRouter } from 'next/navigation';
import { signUp } from "@/firebase/auth";

export default function Login() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const router = useRouter();

    const handleForm = async (event: FormEvent) => {
        event.preventDefault();
        const { error } = await signUp(email, password);
        if (error) {
            console.log("Got error when signing up:", error);
            return;
        }
        // console.log("registered account; result =", result);
        router.push('/');
    }

    return (
        <div>
            <h1 className="text-4xl">Sign up</h1>
            <form className="flex flex-col m-1 p-2 space-y-2 items-end max-w-sm" onSubmit={handleForm}>
                <label className="space-x-4">
                    <span>Email</span>
                    <input className="border rounded p-2" onChange={(e) => setEmail(e.target.value)} required type="email" placeholder="email@example.com" />
                </label>
                <label className="space-x-4">
                    <span>Password</span>
                    <input className="border rounded p-2" onChange={(e) => setPassword(e.target.value)} required type="password" />
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}
