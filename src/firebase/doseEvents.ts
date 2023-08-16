import { DoseInfo, Reaction } from "@/types";
import { FirestoreDataConverter, GeoPoint, Query, QueryDocumentSnapshot, SnapshotOptions, Timestamp, addDoc, collection, doc, getDocs, getFirestore, limit, orderBy, query, startAfter, updateDoc, where } from "firebase/firestore";
import firebaseApp from "./config";

const EVENT_COLLECTION = 'events';

interface DoseInfoDBModel {
    user: string;
    time: Timestamp;
    loc: GeoPoint;
    comment: string;
    rating: number;
}

const db = getFirestore(firebaseApp);

export const doseInfoDataConverter: FirestoreDataConverter<DoseInfo, DoseInfoDBModel> = {
    toFirestore(doseInfo: DoseInfo): DoseInfoDBModel {
        return {
            user: doseInfo.user,
            time: Timestamp.fromDate(doseInfo.time),
            loc: new GeoPoint(doseInfo.pos.lat, doseInfo.pos.lng),
            comment: doseInfo.comment,
            rating: doseInfo.rating,
        };
    },
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): DoseInfo {
        const data = snapshot.data(options) as DoseInfoDBModel;
        return {
            id: snapshot.id,
            user: data.user,
            time: data.time.toDate(),
            pos: { lat: data.loc.latitude, lng: data.loc.longitude },
            comment: data.comment,
            rating: data.rating,
        } ;
    },
};


export async function addDoseEvent(dose: DoseInfo) {
    try {
        const coll = collection(db, EVENT_COLLECTION).withConverter(doseInfoDataConverter)
        await addDoc(coll, dose);
        return { error: null };
    } catch (error) {
        return { error };
    }
}

export async function getRecentEvents(uid: string, numEvents: number, previousSnapshot?: QueryDocumentSnapshot) {
    const coll = collection(db, EVENT_COLLECTION).withConverter(doseInfoDataConverter);
    let q: Query;
    if (previousSnapshot) {
        q = query(coll, where("user", "==", uid), orderBy("time", "desc"), startAfter(previousSnapshot), limit(numEvents))
    } else {
        q = query(coll, where("user", '==', uid), orderBy("time", "desc"), limit(numEvents));
    }
    const docs = await getDocs(q);
    const lastSnapshot = docs.docs[docs.docs.length - 1];
    const events = docs.docs.map((d) => d.data() as DoseInfo)
    return { events, lastSnapshot };
}

export async function addReaction(eventID: string, reaction: Reaction) {
    try {
        const coll = collection(db, EVENT_COLLECTION, eventID, "reactions");
        await addDoc(coll, reaction);
        return { error: null };
    } catch (error) {
        return { error };
    }
}

export async function getReactions(eventID: string) {
    try {
        const coll = collection(db, EVENT_COLLECTION, eventID, "reactions");
        const q = query(coll);
        const snapshot = await getDocs(q);
        const result = snapshot.docs.map((d) => d.data() as Reaction);
        return { result, error: null };
    } catch (error) {
        return { result: null, error };
    }
}