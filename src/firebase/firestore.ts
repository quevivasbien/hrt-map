import firebaseApp from "./config";

import { getFirestore, doc, getDoc, getDocs, addDoc, setDoc, collection, query, where, limit, updateDoc } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import { EMPTY_FRIEND_INFO, EMPTY_FRIEND_REQUEST_INFO, FriendInfo, FriendRequestInfo, UserInfo } from "@/types";

const FRIEND_COLLECTION = 'friends';
const FRIEND_REQUEST_COLLECTION = 'friendRequests';
const USER_COLLECTION = 'users';

const db = getFirestore(firebaseApp);


export async function addItem(collName: string, item: any, id?: string) {
    try {
        if (id) {
            await setDoc(doc(db, collName, id), item, { merge: true });
        } else {
            // automatically assign id
            await addDoc(collection(db, collName), item);
        }
    } catch (error) {
        return { error };
    }
    return { error: null };
}

export async function getItem(collName: string, id: string) {
    const ref = doc(db, collName, id);
    // console.log(`Getting item ${id} from collection ${collName}`);
    try {
        const doc = await getDoc(ref);
        return { result: doc.data(), error: null };
    } catch (error) {
        return { result: null, error };
    }
}

export async function getItems(collName: string, ids: string[]) {
    try {
        const coll = collection(db, collName);
        const q = query(coll, where("__name__", "in", ids));
        const docs = await getDocs(q);

        const items: Record<string, DocumentData> = {};
        docs.forEach((d) => items[d.id] = d.data());
        return { result: items, error: null };
    } catch (error) {
        return { result: null, error };
    }
}

async function initFriendInfo(uid: string) {
    await addItem(FRIEND_COLLECTION, EMPTY_FRIEND_INFO, uid);
}

async function initFriendRequestInfo(uid: string) {
    await addItem(FRIEND_REQUEST_COLLECTION, EMPTY_FRIEND_REQUEST_INFO, uid);
}

export async function getFriendInfo(uid: string) {
    const { result, error } = await getItem(FRIEND_COLLECTION, uid);
    if (error) {
        return { result: null, error };
    }
    if (!result) {
        initFriendInfo(uid);
    }
    return { result: result ? result as FriendInfo : EMPTY_FRIEND_INFO, error: null };
}

export async function getFriendRequests(uid: string) {
    const { result, error } = await getItem(FRIEND_REQUEST_COLLECTION, uid);
    if (error) {
        return { result: null, error };
    }
    if (!result) {
        initFriendRequestInfo(uid);
    }
    return { result: result ? result as FriendRequestInfo : EMPTY_FRIEND_REQUEST_INFO, error: null };
}

export async function setUserInfo(uid: string, info: UserInfo) {
    return await addItem(USER_COLLECTION, info, uid);
}

export async function getUserInfo(uid: string) {
    let { result, error } = await getItem(USER_COLLECTION, uid);
    if (error) {
        return { result: null, error };
    }
    return { result: result ? result as UserInfo : null, error: null };
}

export async function getUserInfoBatch(uids: string[]) {
    let { result, error } = await getItems(USER_COLLECTION, uids);
    if (error) {
        return { result: null, error };
    }
    return { result: result ? result as Record<string, UserInfo> : null, error: null };
}

// find the uid for a user with given username
// if no user exists with that username, will return without error, but result will be null
export async function getUserIdFromName(name: string) {
    try {
        const q = query(collection(db, USER_COLLECTION), where("name", "==", name), limit(1));
        const snapshot = await getDocs(q);
        const id = snapshot.docs.length > 0 ? snapshot.docs[0].id : null;
        return { result: id, error: null };
    } catch (error) {
        return { result: null, error };
    }
}

// send a friend request from user with id `uid` to user with id `other`
// if successful, result is list of current friend requests made by `uid`
export async function sendFriendRequest(uid: string, other: string) {
    try {
        const userRef = doc(db, FRIEND_COLLECTION, uid);
        const otherRequestRef = doc(db, FRIEND_REQUEST_COLLECTION, other);
        const [userDoc, otherDoc] = await Promise.all([
            getDoc(userRef), getDoc(otherRequestRef),
        ]);
        let requestsSent: string[];
        if (!userDoc.exists()) {
            await initFriendInfo(uid);
            requestsSent = [];
        } else {
            requestsSent = (userDoc.data() as FriendInfo).requestsSent;
            // console.log("Requests sent", requestsSent);
        }
        let requesters: string[];
        if (!otherDoc.exists()) {
            await initFriendRequestInfo(other);
            requesters = [];
        } else {
            requesters = (otherDoc.data() as FriendRequestInfo).requesters;
        }
        if (!requestsSent.includes(other)) {
            requestsSent.push(other);
            requesters.push(uid);
            await Promise.all([
                updateDoc(userRef, { requestsSent }),
                updateDoc(otherRequestRef, { requesters }),
            ]);
        } else {
            console.log("Warning: tried to send a friend request to someone to whom you've already sent a friend request");
        }
        return { result: requestsSent, error: null };
    } catch (error) {
        return { result: null, error };
    }
}

export async function respondToFriendRequest(uid: string, requester: string, accept: boolean) {
    try {
        // first remove request from user's list of pending requests
        const requestsRef = doc(db, FRIEND_REQUEST_COLLECTION, uid);
        const { requesters } = (await getDoc(requestsRef)).data() as FriendRequestInfo;
        if (requesters.includes(requester)) {
            await updateDoc(requestsRef, {
                requesters: requesters.filter((r) => r !== requester)
            });
        } else {
            console.log("Tried to respond to a nonexistent friend request.");
            return {
                error: new Error('Tried to respond to a nonexistent friend request.')
            };
        }
        // if accepted, update user's list of friends
        if (accept) {
            const userRef = doc(db, FRIEND_COLLECTION, uid);
            const { friends } = (await getDoc(userRef)).data() as FriendInfo;
            if (friends.includes(requester)) {
                console.log("Tried to accept a friend request from someone you're already friends with");
                return {
                    error: new Error("Tried to accept a friend request from someone you're already friends with"),
                };
            }
            friends.push(requester);
            await updateDoc(userRef, {
                friends,
            });
        }
        return { error: null };
    } catch (error) {
        return { error };
    }
}

// check if other is a friend of uid
export async function isFriend(uid: string, other: string) {
    const { result, error } = await getItem(FRIEND_COLLECTION, other);
    if (error || !result) {
        return { result: false, error };
    }
    const otherInfo = result as FriendInfo;
    return { result: otherInfo.friends.includes(uid), error: null };
}

// go through list of sent friend requests
// check if requestees have accepted/rejected
// if they have accepted, add to friends list
// if rejected, just remove from list of requests
export async function checkSentFriendRequests(uid: string, friendInfo: FriendInfo) {
    try {
        const newFriendInfo = { ...friendInfo };
        let madeChange = false;
        for (const otherUid of friendInfo.requestsSent) {
            const requestInfo = (await getDoc(doc(db, FRIEND_REQUEST_COLLECTION, otherUid))).data() as FriendRequestInfo;
            const otherResponded = !requestInfo.requesters.includes(uid);
            if (otherResponded) {
                madeChange = true;
                newFriendInfo.requestsSent = newFriendInfo.requestsSent.filter((f) => f !== otherUid);
                const accepted = (await isFriend(uid, otherUid)).result;
                if (accepted) {
                    newFriendInfo.friends.push(otherUid);
                }
            }
        }
        if (madeChange) {
            const { error } = await addItem(FRIEND_COLLECTION, newFriendInfo, uid);
            if (error !== null) {
                return { result: null, error };
            }
        }
        return { result: newFriendInfo, error: null };
    } catch (error) {
        return { result: null, error };
    }
}
