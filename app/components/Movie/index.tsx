import { Link } from "@remix-run/react";
import { IconContext } from "react-icons";
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
}

export const Movie = ({ data }: Props) => {
  const currentUser = "Marcus";
  const favorite = false;
  const { id, title, poster_path, vote_average } = data;
  return (
    <Container>
      <Link to="/home">
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
        <Link to={`/movie/${id}`}>
          <Title>{title}</Title>
        </Link>
        {currentUser && (
          <FavButton>
            <IconContext.Provider
              value={{ style: { color: "#FFF", fontSize: 25 } }}
            >
              {favorite ? (
                <BsFillBookmarkStarFill data-testid="favorite-icon" />
              ) : (
                <BsBookmark data-testid="not-favorite-icon" />
              )}
            </IconContext.Provider>
          </FavButton>
        )}
      </TitleContainer>
      <RatingContainer>
        <IconContext.Provider
          value={{ style: { color: "#E7A74E", fontSize: 30 } }}
        >
          <AiFillStar />
        </IconContext.Provider>
        <Rate>{vote_average}/10</Rate>
      </RatingContainer>
    </Container>
  );
};
