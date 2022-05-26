import { SiThemoviedatabase } from "react-icons/si";
import { BsDoorClosedFill } from "react-icons/bs";
import { IconContext } from "react-icons";
import { Container, ItemLink, ItemsContainer, ItemText } from "./styles/header";
import { Link } from "@remix-run/react";

type Props = {
  currentUser?: string;
};
export const Header = ({ currentUser }: Props) => {
  return (
    <Container>
      <Link to="/home">
        <IconContext.Provider
          value={{ style: { color: "#fff", fontSize: 60 } }}
        >
          <SiThemoviedatabase />
        </IconContext.Provider>
      </Link>
      <ItemsContainer>
        <ItemLink to="/home/signin">Entrar</ItemLink>
        <ItemLink to="/home/signup">Registrar</ItemLink>

        {currentUser ? (
          <>
            <ItemText>Seja bem vindo {currentUser}</ItemText>
            <IconContext.Provider value={{ style: { fontSize: 25 } }}>
              <BsDoorClosedFill data-testid="logout" />
            </IconContext.Provider>
          </>
        ) : null}
      </ItemsContainer>
    </Container>
  );
};
