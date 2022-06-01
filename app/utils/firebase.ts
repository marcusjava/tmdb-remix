import type { Movie, User } from "./firebase.types";
import type { DocumentData } from "firebase/firestore";
import { db } from "./db.server";

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
  return await addCollectionDocs("movies", movie);
};

export const removeFavoriteMovieToFirebase = async (movieId: number) => {
  return await removeCollectionDocs("movies", movieId);
};
