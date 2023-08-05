'use client'
import React, { FormEvent } from "react";
import { useRouter } from 'next/navigation';
import SelectRating from "@/components/SelectRating";
import { UserContext } from "@/components/UserContext";
import MapSelect from "@/components/MapSelect";
import { DoseInfo, LatLng } from "@/types";
import { addDoseEvent } from "@/firebase/firestore";


// this is a planned parenthood in kansas city, mo
const DEFAULT_LOC = { lat: 39.044354847871794, lng: -94.57359839762378 };

export default function NewPost() {
    const user = React.useContext(UserContext);
    const [initialLoc, setInitialLoc] = React.useState<LatLng>(DEFAULT_LOC);
    const [loc, setLoc] = React.useState<LatLng>(DEFAULT_LOC);
    const [comment, setComment] = React.useState<string>('');
    const [rating, setRating] = React.useState<number>(0);
    const router = useRouter();

    const handleForm = async (event: FormEvent) => {
        if (user === null) {
            console.log('not logged in');
            return;
        }
        event.preventDefault();
        const doseInfo: DoseInfo = {
            user: user.uid,
            time: new Date(Date.now()),
            pos: { lat: loc.lat, lng: loc.lng },
            comment,
            rating,
        };
        addDoseEvent(doseInfo).then((result) => {
            if (result?.error) {
                console.log("Got error when adding new dose event to DB:", result.error);
            }
        });
    }

    React.useEffect(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
            const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            setInitialLoc(newLoc);
        });
    });

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
                <MapSelect key={JSON.stringify(initialLoc)} pos={initialLoc} setPos={setLoc} />
                <div className="text-end">
                    <button className="p-2 rounded-lg drop-shadow-lg bg-violet-800 text-white hover:bg-indigo-900" type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}