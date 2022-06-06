import type { Movie } from "~/utils/firebase.types";
import {
  Avatar,
  AvatarContainer,
  Description,
  Item,
} from "./styles/dropdown-item.styles";

interface Props {
  movie: Movie;
}

export default function DropdownItem({ movie }: Props) {
  return (
    <Item>
      <AvatarContainer>
        <Avatar
          src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
          alt="Avatar"
        />
      </AvatarContainer>
      <Description>
        <span>{movie?.title}</span>
      </Description>
    </Item>
  );
}
