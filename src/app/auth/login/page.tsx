'use client'
import React, { FormEvent } from "react";
import { useRouter } from 'next/navigation';
import { logIn } from "@/firebase/auth";
import Link from 'next/link';
import { UserContext } from "@/components/UserContext";
import { FirebaseError } from "firebase/app";

export default function Login() {
    const { userAuth } = React.useContext(UserContext);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState<string>();
    const router = useRouter();

    const handleForm = async (event: FormEvent) => {
        event.preventDefault();
        const { error } = await logIn(email, password);
        if (error) {
            const code = (error as FirebaseError).code;
            switch (code) {
                case "auth/wrong-password":
                    setErrorMessage("Incorrect password");
                    break;
                case "auth/user-not-found":
                    setErrorMessage("No account found with this email");
                    break;
                default:
                    console.log("Got error when logging in:", error);
            }
            return;
        }
        // console.log("signed in; result =", result);
        router.push('/');
    }

    if (userAuth) {
        return (
            <div className="text-center">You are already logged in.</div>
        );
    }

    return (
        <div className="flex flex-col items-center">
            <h1>Sign in</h1>
            <form className="flex flex-col m-1 p-2 space-y-2 items-end max-w-sm" onSubmit={handleForm}>
                <label className="space-x-4">
                    <span>Email</span>
                    <input className="border rounded p-2" onChange={(e) => setEmail(e.target.value)} required type="email" placeholder="email@example.com" />
                </label>
                <label className="space-x-4">
                    <span>Password</span>
                    <input className="border rounded p-2" onChange={(e) => setPassword(e.target.value)} required type="password" />
                </label>
                <div className="text-right">
                    <button type="submit">Submit</button>
                </div>
                {errorMessage ? <div className="text-red-700 text-center w-full">{errorMessage}</div> : null}
            </form>
            <div>
                New? <Link href="/auth/register">Register for an account</Link>.
            </div>
        </div>
    )
}
