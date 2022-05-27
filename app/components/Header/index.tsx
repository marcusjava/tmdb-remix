import { SiThemoviedatabase } from "react-icons/si";
import { BsDoorClosedFill } from "react-icons/bs";
import { IconContext } from "react-icons";
import {
  Container,
  ItemLink,
  ItemsContainer,
  ItemText,
  Logout,
} from "./styles/header";
import { Form, Link } from "@remix-run/react";

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
        {currentUser ? (
          <>
            <ItemLink to="/home/signup">Registrar</ItemLink>
            <ItemText>Seja bem vindo(a) {currentUser}</ItemText>
            <Form action="/home/logout" method="post">
              <Logout type="submit">
                <IconContext.Provider value={{ style: { fontSize: 25 } }}>
                  <BsDoorClosedFill data-testid="logout" />
                </IconContext.Provider>
              </Logout>
            </Form>
          </>
        ) : (
          <>
            <ItemLink to="/home/signup">Registrar</ItemLink>
            <ItemLink to="/home/signin">Entrar</ItemLink>
          </>
        )}
      </ItemsContainer>
    </Container>
  );
};
