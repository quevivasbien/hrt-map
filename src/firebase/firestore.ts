import firebaseApp from "./config";

import { getFirestore, doc, getDoc, getDocs, setDoc, collection, query, where, orderBy, limit} from 'firebase/firestore';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import type { User } from 'firebase/auth';

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

interface DoseEvent {
    user: string;
    time: Date;
    loc: GeolocationCoordinates;
    comment: string;
    rating: number;
}

export async function addEvent(event: DoseEvent) {
    const id = `${event.user}_${event.time.getUTCSeconds()}`;
    return addItem(EVENT_COLLECTION, id, event);
}

function parseEventDoc(doc: QueryDocumentSnapshot<DocumentData, DocumentData>) {
    const { time, loc, comment, rating } = doc.data();
    return {
        time: time.toDate(),
        loc: loc.toJSON(),
        comment,
        rating,
    };
}

export async function getRecentEvents(user: User, numEvents: number) {
    const coll = collection(db, EVENT_COLLECTION);
    const q = query(coll, where("user", '==', user.uid), orderBy("time", "desc"), limit(numEvents));
    const docs = await getDocs(q);
    const events: DocumentData[] = [];
    docs.forEach((d) => {
        events.push(parseEventDoc(d));
    });
    return events;
}