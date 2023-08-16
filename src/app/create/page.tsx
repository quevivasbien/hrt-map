'use client'
import React, { FormEvent } from "react";
import { useRouter } from 'next/navigation';
import SelectRating from "@/components/SelectRating";
import { UserContext } from "@/components/UserContext";
import MapSelect from "@/components/MapSelect";
import { DoseInfo, LatLng } from "@/types";
import { addDoseEvent } from "@/firebase/doseEvents";


// this is a planned parenthood in kansas city, mo
const DEFAULT_LOC = { lat: 39.044354847871794, lng: -94.57359839762378 };

export default function NewPost() {
    const { userAuth } = React.useContext(UserContext);
    const [shouldRequestLoc, setShouldRequestLoc] = React.useState<boolean>(true);
    const [loadingGeoLoc, setLoadingGeoLoc] = React.useState<boolean>(true);
    const [initialLoc, setInitialLoc] = React.useState<LatLng>(DEFAULT_LOC);
    const [loc, setLoc] = React.useState<LatLng>(DEFAULT_LOC);
    const [comment, setComment] = React.useState<string>('');
    const [rating, setRating] = React.useState<number>(0);
    const router = useRouter();

    const handleForm = async (event: FormEvent) => {
        if (userAuth === null) {
            console.log('not logged in');
            return;
        }
        event.preventDefault();
        const doseInfo: DoseInfo = {
            user: userAuth.uid,
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
        router.push("/recent");
    }

    React.useEffect(() => {
        if (shouldRequestLoc) {
            setShouldRequestLoc(false);
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                    setLoc(newLoc);
                    setInitialLoc(newLoc);
                    setLoadingGeoLoc(false);
                },
                (err) => {
                    console.log("When requesting user geolocation, got:", err);
                    setLoadingGeoLoc(false);
                },
            );
            console.log("requested initial loc");
        }
    }, [shouldRequestLoc, initialLoc]);

    const mapSelect = <MapSelect key={JSON.stringify(initialLoc)} pos={initialLoc} setPos={setLoc} />;
    let mapSelectBox: React.JSX.Element;
    if (loadingGeoLoc) {
        mapSelectBox = <div className="relative">
            <div className="opacity-20">
                {mapSelect}
            </div>
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 flex items-center justify-center">
                <div>Loading your position...</div>
            </div>
        </div>
    } else {
        mapSelectBox = <div>{mapSelect}</div>;
    }

    return (
        <div className="flex flex-col items-center">
            <h1>Make a new entry</h1>
            <div className="mx-1 flex flex-col space-y-8 w-full sm:w-3/4 max-w-md">
                <div>
                    <div className="font-bold m-2">Rating</div>
                    <SelectRating setSharedRating={setRating} />
                </div>
                <label>
                    <div className="font-bold m-2">Comments</div>
                    <textarea rows={4} className="border rounded p-2 w-full" onChange={(e) => setComment(e.target.value)} />
                </label>
                {mapSelectBox}
                <div className="text-end">
                    <button className="p-2 rounded-lg drop-shadow-lg bg-violet-800 text-white hover:bg-indigo-900" onClick={handleForm}>Submit</button>
                </div>
            </div>
        </div>
    )
}