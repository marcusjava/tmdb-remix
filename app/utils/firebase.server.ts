import * as admin from "firebase-admin";
import type { Movie, User } from "./firebase.types";
import type { DocumentData } from "firebase/firestore";

//SERVER!!!!!!!!

import { getFirestore } from "firebase-admin/firestore";
import type { Auth } from "firebase-admin/auth";
import { getAuth } from "firebase-admin/auth";

const serviceAccount = require("../../serviceAccount.json");

let app;
let auth: Auth;
let db: admin.firestore.Firestore;
let serverAdmin;

if (!admin.apps.length) {
  serverAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

db = getFirestore();
auth = getAuth();

const converter = <T>() => ({
  toFirestore: (data: Partial<T>): DocumentData => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
    snap.data() as T,
});

export const addCollectionDocs = async (
  collectionKey: string,
  objectToAdd: User | Movie
) => {
  const collectionRef = db
    .collection(collectionKey)
    .withConverter(converter<User | Movie>());
  const docRef = await collectionRef.add(objectToAdd);
  const doc = await docRef.get();
  return { ...doc.data(), docId: doc.id };
};

export const removeCollectionDocs = async (
  collectionKey: string,
  id: number
) => {
  const collectionRef = await db
    .collection(collectionKey)
    .where("id", "==", id)
    .get();
  collectionRef.docs.forEach((doc) => doc.ref.delete());
};

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

export const getMoviesDocs = async (userId: string) => {
  const movies: Movie[] = [];
  const collectionRef = await db
    .collection("movies")
    .withConverter(converter<Movie>())
    .where("userId", "==", userId)
    .get();

  collectionRef.docs.forEach((doc) =>
    movies.push({ ...doc.data(), docId: doc.id })
  );

  return movies;
};

export const addFavoriteMovieToFirebase = async (
  userId: number,
  movie: Movie
) => {
  return await addCollectionDocs("movies", { ...movie, userId: userId });
};

export const removeFavoriteMovieToFirebase = async (movieId: number) => {
  return await removeCollectionDocs("movies", movieId);
};

export { app, auth, db, serverAdmin };
