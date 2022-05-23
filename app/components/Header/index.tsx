import { SiThemoviedatabase } from "react-icons/si";
import { BsDoorClosedFill } from "react-icons/bs";
import { IconContext } from "react-icons";
import { Container, ItemLink, ItemsContainer, ItemText } from "./styles/header";
import { Link } from "@remix-run/react";

export const Header = () => {
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
        <ItemText>
          Seja bem vindo Marcus
          <IconContext.Provider value={{ style: { fontSize: 25 } }}>
            <BsDoorClosedFill data-testid="logout" />
          </IconContext.Provider>{" "}
        </ItemText>
      </ItemsContainer>
    </Container>
  );
};
