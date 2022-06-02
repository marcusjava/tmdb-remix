import {
  Container,
  Thumbnail,
  Title,
  Description,
  DetailContainer,
  GenresContainer,
  TitleContainer,
  FavButton,
  Tag,
} from "../styles/detail.styles";
import Star from "react-star-ratings";
import { BsBookmark, BsFillBookmarkStarFill } from "react-icons/bs";
import { IconContext } from "react-icons";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getMovieById } from "~/service/api";
import type { Movie } from "~/utils/firebase.types";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import { getUserSession } from "~/utils/session.server";
import {
  addFavoriteMovieToFirebase,
  getMoviesDocs,
  removeFavoriteMovieToFirebase,
} from "~/utils/firebase";

interface LoaderData {
  movie: Movie;
  currentUser: string | null;
  favorite: boolean;
}

export const loader: LoaderFunction = async ({
  params,
  request,
}): Promise<LoaderData | Response> => {
  const { id } = params;

  let favorites: Movie[] = [];
  console.log("LOADING...........");

  if (!id) {
    return redirect("/home");
  }
  try {
    const currentUser = await getUserSession(request);

    const userId = currentUser?.user_id;
    const movie: Movie = await getMovieById(id);

    if (!movie) {
      throw new Error("Movie not found!");
    }

    if (userId) {
      favorites = await getMoviesDocs(userId);
    }

    return {
      movie,
      currentUser: userId,
      favorite: Boolean(favorites.find((movie) => movie.userId === userId)),
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const action: ActionFunction = async ({ request, params }) => {
  const { id } = params;

  const currentUser = await getUserSession(request);
  const userId = currentUser?.user_id;
  if (!userId) {
    return redirect(".");
  }
  if (typeof id !== "string") {
    throw new Error("Form submitted incorrectly");
  }
  const movie: Movie = await getMovieById(id);
  if (!movie) {
    throw new Error("Movie not found!");
  }
  const favorites = await getMoviesDocs(userId);
  const isFavorite = Boolean(
    favorites.find((movie) => movie.userId === userId)
  );

  if (isFavorite) {
    await removeFavoriteMovieToFirebase(+movie.id);
    console.log("removido");
  } else {
    //add
    await addFavoriteMovieToFirebase(userId, movie);
    console.log("adicionado");
  }

  return redirect(`/home/movie/${id}`);
};

export default function MovieDetail() {
  const { movie, currentUser, favorite } = useLoaderData<LoaderData>();

  console.log(favorite);

  //backdrop_path
  return (
    <Container
      imageUrl={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
    >
      <Thumbnail
        src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
        alt="banner"
      />
      <DetailContainer>
        <TitleContainer>
          <Title data-testid="title">{movie.title}</Title>
          {currentUser && (
            <Form method="post">
              <FavButton data-testid="favorite-button">
                {favorite ? (
                  <BsFillBookmarkStarFill
                    data-testid="favorite-icon"
                    size={60}
                    style={{ fill: "white" }}
                  />
                ) : (
                  <BsBookmark
                    data-testid="not-favorite-icon"
                    size={60}
                    style={{ fill: "white" }}
                  />
                )}
              </FavButton>
            </Form>
          )}
        </TitleContainer>
        <Star
          rating={movie.vote_average}
          starRatedColor="#e7a74e"
          numberOfStars={10}
          name="rating"
          data-testid="star"
        />
        <Description data-testid="description">{movie.overview}</Description>

        <GenresContainer>
          {movie.genres?.map((item) => (
            <Tag key={item.id}>{item.name}</Tag>
          ))}
        </GenresContainer>
      </DetailContainer>
    </Container>
  );
}
