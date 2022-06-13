import { Link } from "@remix-run/react";
import { AiFillStar } from "react-icons/ai";
import NoImage from "../../assets/no-image.png";
import { BsBookmark, BsFillBookmarkStarFill } from "react-icons/bs";
import type { Movie as MovieI } from "~/utils/firebase.types";
import {
  Container,
  Thumbnail,
  Title,
  RatingContainer,
  Rate,
  TitleContainer,
  FavButton,
} from "./styles/movie";

interface Props {
  data: MovieI;
  currentUser?: string;
  isFavorite?: boolean;
}

export const Movie = ({ data, currentUser, isFavorite }: Props) => {
  const { id, title, poster_path, vote_average } = data;
  return (
    <Container>
      <Link to={`/home/movie/${id}`}>
        <Thumbnail
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/original${poster_path}`
              : NoImage
          }
          alt="movie image"
        />
      </Link>
      <TitleContainer>
        <Link to={`/home/movie/${id}`}>
          <Title>{title}</Title>
        </Link>
        {currentUser && (
          <FavButton>
            {isFavorite ? (
              <BsFillBookmarkStarFill
                size={25}
                data-testid="favorite-icon"
                style={{ fill: "white" }}
              />
            ) : (
              <BsBookmark
                data-testid="not-favorite-icon"
                size={25}
                style={{ fill: "white" }}
              />
            )}
          </FavButton>
        )}
      </TitleContainer>
      <RatingContainer>
        <AiFillStar size={30} style={{ fill: "white" }} />
        <Rate>{vote_average}/10</Rate>
      </RatingContainer>
    </Container>
  );
};
