import firebaseApp from "./config";
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, getAuth } from 'firebase/auth';

const auth = getAuth(firebaseApp);

export async function signUp(email: string, password: string) {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        return { result, error: null };
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