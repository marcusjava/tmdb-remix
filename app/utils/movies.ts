import type { Movie } from "./firebase.types";

export const getListMovies = (size: number, movies: Movie[]) => {
  return movies.slice(0, size);
};

export const randomBanner = (movies: Movie[]) => {
  const idx = Math.floor(Math.random() * movies.length);
  return movies[idx];
};
