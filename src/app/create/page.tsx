'use client'
import React, { FormEvent } from "react";
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, getAuth, type User } from 'firebase/auth';
import firebaseApp from "@/firebase/config";

const auth = getAuth(firebaseApp);

export default function NewPost() {
    const [loc, setLoc] = React.useState<GeolocationCoordinates | null>(null);
    const [comment, setComment] = React.useState<string>('');
    const [rating, setRating] = React.useState<number | null>(null);
    const [user, setUser] = React.useState<string | null>(null);
    const router = useRouter();

    React.useEffect(() => {
        onAuthStateChanged(auth, (user: User | null) => {
            setUser(user?.uid ?? null);
        });
    });

    const handleForm = async (event: FormEvent) => {
        if (user === null) {
            console.log('not logged in');
            return;
        }
        event.preventDefault();
    }

    return (
        <div>
            <h1 className="text-4xl">Make a new entry</h1>
            <form className="mx-1 p-2 space-y-8 max-w-xl" onSubmit={handleForm}>
                <div className="font-bold m-2">Rating</div>
                <label className="flex flex-row space-x-4">
                    <input type="range" min={1} max={5} step={1} onChange={(e) => setRating(parseInt(e.target.value))} />
                    <div>{rating}</div>
                </label>
                <label className="space-x-4">
                    <div className="font-bold m-2">Comments</div>
                    <textarea rows={4} className="border rounded p-2 w-full" onChange={(e) => setComment(e.target.value)} />
                </label>
                <button className="p-2 rounded-lg drop-shadow-lg bg-violet-800 text-white hover:bg-indigo-900" type="submit">Submit</button>
            </form>
        </div>
    )
}