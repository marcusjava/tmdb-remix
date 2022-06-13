export interface SignUpProps {
  email: string;
  password: string;
  displayName: string;
}

export interface SignInProps {
  email: string;
  password: string;
}

export type Genres = {
  id: number;
  name: string;
};

export interface Movie {
  id: number;
  docId?: string;
  title: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  userId: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  adult: boolean;
  backdrop_path: string;
  genre_ids: [number];
  genres: Genres[];
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  createdAt?: Date;
}
