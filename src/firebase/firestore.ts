import firebaseApp from "./config";

import { getFirestore, doc, getDoc, getDocs, setDoc, collection, query, where, orderBy, limit, startAfter, GeoPoint, Timestamp} from 'firebase/firestore';
import type { Query, QueryDocumentSnapshot } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { DoseInfo, LatLng } from "@/types";

const EVENT_COLLECTION = process.env.NEXT_PUBLIC_FIRESTORE_EVENT_COLLECTION as string;

const db = getFirestore(firebaseApp);

async function addItem(collection: string, id: string, item: any) {
    try {
        await setDoc(doc(db, collection, id), item, { merge: true });
    } catch (error) {
        return { error };
    }
    return { error: null };
}

async function getItem(collection: string, id: string) {
    const ref = doc(db, collection, id);
    try {
        const result = await getDoc(ref);
        return { result, error: null };
    } catch (error) {
        return { result: null, error };
    }
}

interface FirebaseDoseInfo {
    user: string;
    time: Timestamp;
    loc: GeoPoint;
    comment: string;
    rating: number;
}

export async function addDoseEvent(dose: DoseInfo) {
    const id = `${dose.user}_${dose.time.getTime()}`;
    // convert to expected format
    const { user, time, pos, comment, rating } = dose;
    if (user === undefined) {
        console.log("'user' field of DoseInfo must not be undefined when making query")
        return;
    }
    const data = {
        user,
        time: Timestamp.fromDate(time),
        loc: new GeoPoint(pos.lat, pos.lng),
        comment,
        rating,
    };
    return addItem(EVENT_COLLECTION, id, data);
}

// converts document snapshot into DoseInfo
function parseEventDoc(doc: QueryDocumentSnapshot): DoseInfo {
    const { user, time, loc, comment, rating } = doc.data() as FirebaseDoseInfo;
    return {
        user,
        time: time.toDate() as Date,
        pos: { lat: loc.latitude, lng: loc.longitude },
        comment,
        rating,
    };
}

export async function getRecentEvents(user: User, numEvents: number, previousSnapshot?: QueryDocumentSnapshot) {
    const coll = collection(db, EVENT_COLLECTION);
    let q: Query;
    if (previousSnapshot) {
        q = query(coll, where("user", "==", user.uid), orderBy("time", "desc"), startAfter(previousSnapshot), limit(numEvents))
    } else {
        q = query(coll, where("user", '==', user.uid), orderBy("time", "desc"), limit(numEvents));
    }
    const docs = await getDocs(q);
    const events: DoseInfo[] = [];
    docs.forEach((d) => {
        events.push(parseEventDoc(d));
    });
    const lastSnapshot = docs.docs[docs.docs.length - 1];
    return { events, lastSnapshot };
}