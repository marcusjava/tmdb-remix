import type { Movie } from "~/utils/firebase.types";
import DropdownItem from "../DropdownItem";
import { DropdownCustom, Items, NoItems } from "./styles/dropdown-items.styles";

interface Props {
  favorites: Movie[];
}

const DropdownItems = ({ favorites }: Props) => {
  return (
    <DropdownCustom>
      <Items>
        {favorites.length ? (
          favorites.map((movie) => (
            <DropdownItem movie={movie} key={movie.id} />
          ))
        ) : (
          <NoItems>Sem items</NoItems>
        )}
      </Items>
    </DropdownCustom>
  );
};

export default DropdownItems;
