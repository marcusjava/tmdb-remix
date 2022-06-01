import { Form } from "@remix-run/react";
import { useState } from "react";
import {
  SearchButton,
  SearchContainer,
  SearchInput,
  SubTitle,
  Title,
} from "./styles/banner.styles";
import {
  Container,
  Content,
  Image,
  TextContainer,
} from "./styles/banner.styles";

interface Props {
  imageSrc: string;
}

export const Banner = ({ imageSrc }: Props) => {
  const [term, setTerm] = useState("");
  return (
    <Container>
      <Content>
        <Image
          src={`https://image.tmdb.org/t/p/original${imageSrc}`}
          alt="Banner"
        />

        <TextContainer>
          <Title>Bem-Vindo(a).</Title>
          <SubTitle>
            Milhões de Filmes, Séries e Pessoas para Descobrir. Explore já.
          </SubTitle>

          <SearchContainer>
            <Form
              method="post"
              action={`/home/movie/search/${term
                .toLowerCase()
                .replace(" ", "+")}`}
            >
              <SearchInput
                name="search"
                required
                onChange={({ target }) => setTerm(target.value)}
              />
              <SearchButton type="submit">Ir</SearchButton>
            </Form>
          </SearchContainer>
        </TextContainer>
      </Content>
    </Container>
  );
};
