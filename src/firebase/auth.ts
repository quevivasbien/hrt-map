import firebaseApp from "./config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, getAuth, type User, updateProfile } from 'firebase/auth';
import { setUserInfo } from "./firestore";

const auth = getAuth(firebaseApp);

export async function signUp(email: string, username: string, password: string) {
    try {
        let result = await createUserWithEmailAndPassword(auth, email, password);
        const { error } = await setUserInfo(result.user.uid, { name: username });
        return { result, error };
    } catch (error) {
        return { result: null, error };
    }
}

export async function logIn(email: string, password: string) {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return { result, error: null };
    } catch (error) {
        return { result: null, error };
    }
}

export async function logOut() {
    try {
        await signOut(auth);
        return { error: null };
    } catch (error) {
        return { error };
    }
}
