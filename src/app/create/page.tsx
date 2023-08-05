'use client'
import React, { FormEvent } from "react";
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, getAuth, type User } from 'firebase/auth';
import firebaseApp from "@/firebase/config";
import SelectRating from "@/components/SelectRating";
import { UserContext } from "@/components/UserContext";


export default function NewPost() {
    const user = React.useContext(UserContext);
    const [loc, setLoc] = React.useState<GeolocationCoordinates | null>(null);
    const [comment, setComment] = React.useState<string>('');
    const [rating, setRating] = React.useState<number>(0);
    const router = useRouter();

    const handleForm = async (event: FormEvent) => {
        if (user === null) {
            console.log('not logged in');
            return;
        }
        event.preventDefault();
    }

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-4xl">Make a new entry</h1>
            <form className="mx-1 p-2 flex flex-col space-y-8 sm:w-2/3 max-w-md" onSubmit={handleForm}>
                <div>
                    <div className="font-bold m-2">Rating</div>
                    <SelectRating setSharedRating={setRating} />
                </div>
                <label>
                    <div className="font-bold m-2">Comments</div>
                    <textarea rows={4} className="border rounded p-2 w-full" onChange={(e) => setComment(e.target.value)} />
                </label>
                <div className="text-end">
                    <button className="p-2 rounded-lg drop-shadow-lg bg-violet-800 text-white hover:bg-indigo-900" type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}