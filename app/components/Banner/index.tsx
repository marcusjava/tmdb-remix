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
            <SearchInput />
            <SearchButton>Ir</SearchButton>
          </SearchContainer>
        </TextContainer>
      </Content>
    </Container>
  );
};
