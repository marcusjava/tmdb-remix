import admin from "firebase-admin";
import firebase from "firebase/app";
import {
  applicationDefault,
  initializeApp as initializeAdminApp,
} from "firebase-admin/app";
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  signOut,
} from "firebase/auth";
import type { Movie, SignInProps, SignUpProps, User } from "./firebase.types";

require("dotenv").config();

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "moviedb-2ec85.firebaseapp.com",
  projectId: "moviedb-2ec85",
  storageBucket: "moviedb-2ec85.appspot.com",
  messagingSenderId: "232551473309",
  appId: "1:232551473309:web:338ecedc752df1b5947474",
};

let Firebase: any;

if (!Firebase?.apps?.length) {
  Firebase = initializeApp(firebaseConfig);
}

if (!admin.apps.length)
  initializeAdminApp({
    credential: applicationDefault(),
    databaseURL: "https://moviedb-2ec85.firebaseio.com",
  });

const db = admin.firestore();
const adminAuth = admin.auth();

export const createUserProfileDocument = async (
  data: any,
  user: User | null
) => {
  if (!user) return;

  const userRef = db.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();
  if (!snapshot.exists) {
    //criando usuario
    const { displayName, email } = user;
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...data,
      });
    } catch (error: any) {
      console.log("error while creating user" + error.message);
    }
  }

  return userRef;
};

async function signIn({ email, password }: SignInProps) {
  const auth = getAuth();
  return signInWithEmailAndPassword(auth, email, password);
}

async function signUp({ email, password, displayName }: SignUpProps) {
  const auth = getAuth();
  return createUserWithEmailAndPassword(auth, email, password);
}

async function getSessionToken(idToken: string) {
  const decodedToken = await adminAuth.verifyIdToken(idToken);
  if (new Date().getTime() / 1000 - decodedToken.auth_time > 5 * 60) {
    throw new Error("Recent sign in required");
  }
  const twoWeeks = 60 * 60 * 24 * 14 * 1000;
  return adminAuth.createSessionCookie(idToken, { expiresIn: twoWeeks });
}

async function signOutFirebase() {
  await signOut(getAuth());
}

export { db, signUp, signIn, adminAuth, signOutFirebase, getSessionToken };