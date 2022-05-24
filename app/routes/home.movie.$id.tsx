import {
  Container,
  Thumbnail,
  Title,
  Description,
  DetailContainer,
  GenresContainer,
  TitleContainer,
  FavButton,
} from "../styles/detail.styles";
import Star from "react-star-ratings";
import { BsBookmark, BsFillBookmarkStarFill } from "react-icons/bs";
import { IconContext } from "react-icons";
import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getMovieById } from "~/service/api";
import type { Movie } from "~/utils/firebase.types";
import { useLoaderData } from "@remix-run/react";

interface LoaderData {
  movie: Movie;
}

export const loader: LoaderFunction = async ({
  params,
  request,
}): Promise<LoaderData | Response> => {
  const { id } = params;

  if (!id) {
    return redirect("/home");
  }
  try {
    const movie: Movie = await getMovieById(id);
    console.log(movie);

    if (!movie) {
      throw new Error("Movie not found!");
    }

    return { movie };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export default function MovieDetail() {
  const currentUser = "Marcus";
  const favorite = true;
  const firebaseLoading = false;

  const { movie } = useLoaderData<LoaderData>();
  return (
    <Container>
      <Thumbnail
        src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
        alt="banner"
      />
      <DetailContainer>
        <TitleContainer>
          <Title data-testid="title">{movie.title}</Title>
          {currentUser && (
            <FavButton
              data-testid="favorite-button"
              /*   onClick={() =>
                favorite
                  ? removeFavoriteFromFirebase(movie)
                  : addFavoriteMovieToFirebase(movie)
              } */
            >
              <IconContext.Provider
                value={{ style: { color: "#fff", fontSize: 60 } }}
              >
                {/*   {firebaseLoading ? (
                  <Loader
                    type="Oval"
                    color="#00BFFF"
                    height={60}
                    width={60}
                    visible={firebaseLoading}
                    data-testid="fav-loading"
                  />
                ) : favorite ? (
                  <BsFillBookmarkStarFill data-testid="favorite-icon" />
                ) : (
                  <BsBookmark data-testid="not-favorite-icon" />
                )} */}
                <BsBookmark data-testid="not-favorite-icon" />
              </IconContext.Provider>
            </FavButton>
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
            /*  <Tag key={item.id}>{item.name}</Tag> */
            <p key={item.id}>{item.name}</p>
          ))}
        </GenresContainer>
      </DetailContainer>
    </Container>
  );
}
