import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";
import type { Movie, SignUpProps, User } from "./firebase.types";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "moviedb-2ec85.firebaseapp.com",
  projectId: "moviedb-2ec85",
  storageBucket: "moviedb-2ec85.appspot.com",
  messagingSenderId: "232551473309",
  appId: "1:232551473309:web:338ecedc752df1b5947474",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();

export const firestore = firebase.firestore();

export const Firebase = firebase;

const converter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: firebase.firestore.QueryDocumentSnapshot) =>
    snap.data() as T,
});

export const createUserProfileDocument = async (user: User, data: any) => {
  if (!user) return;
  const userRef = firestore.doc(`users/${user.uid}`);
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

export const getCurrentUser = () =>
  new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      unsubscribe();
      resolve(userAuth);
    }, reject);
  });

export const googleProvider = new firebase.auth.GoogleAuthProvider();

googleProvider.setCustomParameters({ prompt: "select_account" });

export const signInWithGoogle = () => auth.signInWithPopup(googleProvider);

export const addCollectionDocs = async (
  collectionKey: string,
  objectToAdd: User | Movie
) => {
  const collectionRef = firestore
    .collection(collectionKey)
    .withConverter(converter<User | Movie>());
  const docRef = await collectionRef.add(objectToAdd);
  const doc = await docRef.get();
  return { ...doc.data(), docId: doc.id };
};

export const removeCollectionDocs = async (
  collectionKey: string,
  id: string
) => {
  const collectionRef = await firestore
    .collection(collectionKey)
    .where("id", "==", id)
    .get();
  collectionRef.docs.forEach((doc) => doc.ref.delete());
};

export const getMoviesDocs = async (userId: string) => {
  const movies: Movie[] = [];
  const collectionRef = await firestore
    .collection("movies")
    .withConverter(converter<Movie>())
    .where("userId", "==", userId)
    .get();

  collectionRef.docs.forEach((doc) =>
    movies.push({ ...doc.data(), docId: doc.id })
  );

  return movies;
};

export const signUp = async ({ email, password, displayName }: SignUpProps) => {
  const { user } = await auth.createUserWithEmailAndPassword(email, password);
  if (user) {
    await createUserProfileDocument(user, { displayName });
  }
};

export default firebase;
