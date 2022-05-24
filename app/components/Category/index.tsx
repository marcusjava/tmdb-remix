import type { Movie as MovieI } from "~/utils/firebase.types";
import { Movie } from "../Movie";
import { Container, Title, ItemsContainer } from "./styles/category";

interface Props {
  title: string;
  items: MovieI[];
}

export const Category = ({ title, items }: Props) => {
  return (
    <Container>
      <Title>{title}</Title>
      <ItemsContainer numberOfItems={items.length}>
        {items.map((item) => (
          <Movie key={item.id} data={item} />
        ))}
      </ItemsContainer>
    </Container>
  );
};
