import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData, useParams } from "@remix-run/react";
import { searchMovies } from "~/service/api";
import type { Movie } from "~/utils/firebase.types";
import {
  Container,
  MovieCard,
  Image,
  Title,
  Content,
  ReleaseDate,
  Description,
} from "~/styles/search.styles";
import NoImage from "~/assets/no-image.png";
import { truncateWords } from "~/utils/truncateWords";

type LoaderData = {
  movies: Movie[];
};

export const loader: LoaderFunction = async ({
  params,
  request,
}): Promise<LoaderData> => {
  const { term } = params;

  if (typeof term !== "string" || !term) {
    throw new Error("Invalid data");
  }

  const movies = await searchMovies(term);

  return { movies };
};

export const action: ActionFunction = async ({
  params,
  request,
}): Promise<LoaderData> => {
  const { term } = params;

  if (typeof term !== "string" || !term) {
    throw new Error("Invalid data");
  }

  const movies = await searchMovies(term);

  return { movies };
};

export default function Search() {
  const { movies } = useLoaderData<LoaderData>();
  const { term } = useParams();
  return (
    <Container>
      <Title>Resultados da pesquisa para: {term}</Title>
      {movies.map((movie: Movie) => (
        <MovieCard key={movie.id}>
          <Link to={`/home/movie/${movie.id}`}>
            <Image
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                  : NoImage
              }
              alt="Poster"
            />
          </Link>
          <Content>
            <Link to={`/home/movie/${movie.id}`}>
              <Title>{movie.title}</Title>
            </Link>
            <ReleaseDate>{movie.release_date}</ReleaseDate>
            <Description>{truncateWords(movie.overview, 400)}</Description>
          </Content>
        </MovieCard>
      ))}
    </Container>
  );
}
