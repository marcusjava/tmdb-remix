import { SiThemoviedatabase } from "react-icons/si";
import { BsDoorClosedFill } from "react-icons/bs";
import {
  Container,
  ItemLink,
  ItemsContainer,
  ItemText,
  Logout,
} from "./styles/header";
import { Form, Link } from "@remix-run/react";
import Dropdown from "../Dropdown";

type Props = {
  currentUser?: string;
};
export const Header = ({ currentUser }: Props) => {
  return (
    <Container>
      <Link to="/home">
        <SiThemoviedatabase size={60} style={{ fill: "white" }} />
      </Link>
      <ItemsContainer>
        {currentUser ? (
          <>
            <ItemLink to="/home/signup">Registrar</ItemLink>
            <ItemText>Seja bem vindo(a) {currentUser}</ItemText>
            <Form action="/home/logout" method="post">
              <Logout type="submit">
                <BsDoorClosedFill
                  data-testid="logout"
                  size={25}
                  style={{ fill: "white" }}
                />
              </Logout>
            </Form>
            <Dropdown />
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
