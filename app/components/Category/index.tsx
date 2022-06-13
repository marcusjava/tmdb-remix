import { useLoaderData } from "@remix-run/react";
import type { LoaderHomeData } from "~/routes/home";
import type { Movie as MovieI } from "~/utils/firebase.types";
import { Movie } from "../Movie";
import { Container, Title, ItemsContainer } from "./styles/category";

interface Props {
  title: string;
  items: MovieI[];
}

export const Category = ({ title, items }: Props) => {
  const { currentUser, favorites } = useLoaderData<LoaderHomeData>();

  return (
    <Container>
      <Title>{title}</Title>
      <ItemsContainer numberOfItems={items.length}>
        {items.map((item) => (
          <Movie
            key={item.id}
            data={item}
            currentUser={currentUser?.displayName}
            isFavorite={Boolean(favorites.find((fav) => fav.id === item.id))}
          />
        ))}
      </ItemsContainer>
    </Container>
  );
};
