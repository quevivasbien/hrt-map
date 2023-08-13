'use client'
import React, { FormEvent } from "react";
import { useRouter } from 'next/navigation';
import { signUp } from "@/firebase/auth";
import Link from 'next/link';
import { FirebaseError } from "firebase/app";
import { getUserIdFromName } from "@/firebase/firestore";

export default function Register() {
    const [email, setEmail] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [processing, setProcessing] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState<string>();
    const router = useRouter();

    const handleForm = async (event: FormEvent) => {
        event.preventDefault();
        if (processing) {
            return;
        }
        setProcessing(true);
        // check first if username is already taken
        const idResult = await getUserIdFromName(username);
        if (idResult.error) {
            console.log("Problem checking username availability:", idResult.error);
            setErrorMessage("Something went wrong");
            setProcessing(false);
            return;
        }
        if (idResult.result) {
            setErrorMessage("Username is already taken");
            setProcessing(false);
            return;
        }
        const { error } = await signUp(email, username, password);
        if (error) {
            const code = (error as FirebaseError).code;
            switch (code) {
                case "auth/email-already-in-use":
                    setErrorMessage("Email is already in use");
                    break;
                case "auth/invalid-email":
                    setErrorMessage("Invalid email address");
                    break;
                case "auth/weak-password":
                    setErrorMessage("Weak password: password should be at least 6 characters");
                    break;
                default:
                    console.log("Got error when signing up:", error);
                    setErrorMessage(`Something went wrong -- error code ${code}`);
            }
            setProcessing(false);
            return;
        }
        router.push('/');
    }

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-4xl">Sign up</h1>
            <form className="flex flex-col m-1 p-2 space-y-2 items-end max-w-sm" onSubmit={handleForm}>
                <label className="space-x-4">
                    <span>Email</span>
                    <input className="border rounded p-2 disabled:bg-gray-100" onChange={(e) => setEmail(e.target.value)} required type="email" placeholder="email@example.com" disabled={processing} />
                </label>
                <label className="space-x-4">
                    <span>Username</span>
                    <input className="border rounded p-2 disabled:bg-gray-100" onChange={(e) => setUsername(e.target.value)} required type="text" placeholder="user123" minLength={4} maxLength={20} disabled={processing}  />
                </label>
                <label className="space-x-4">
                    <span>Password</span>
                    <input className="border rounded p-2 disabled:bg-gray-100" onChange={(e) => setPassword(e.target.value)} required type="password" disabled={processing}  />
                </label>
                <div className="text-right">
                    <button className="p-2 rounded-lg drop-shadow-lg bg-violet-800 text-white hover:bg-indigo-900" type="submit" disabled={processing} >Submit</button>
                </div>
                {errorMessage ? <div className="text-red-700 text-center w-full">{errorMessage}</div> : null}
            </form>
            <div>
                Already have an account? <Link href="/auth/login">Sign in</Link>.
            </div>
        </div>
    )
}
