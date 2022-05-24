import {
  Container,
  SignContainer,
  Card,
  ButtonContainer,
  Title,
  SubTitle,
  Form,
  Error,
} from "../styles/auth.styles";
import { SiThemoviedatabase } from "react-icons/si";
import { IconContext } from "react-icons";
import FormInput from "~/components/Input";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Button } from "~/components/Button";

export const loader: LoaderFunction = async ({ params, request }) => {
  return null;
};

export const action: ActionFunction = async () => {};

export default function SignIn() {
  return (
    <Container>
      <IconContext.Provider value={{ style: { fontSize: 90 } }}>
        <SiThemoviedatabase />
      </IconContext.Provider>
      <SignContainer>
        <Card>
          <Title>Já possuo uma conta</Title>
          <SubTitle>Entre com seu Email e Senha</SubTitle>
          <Form>
            <FormInput
              placeholder="Email"
              autoComplete="none"
              data-testid="signin_email"
              name="email"
              type="email"
              required
            />
            <FormInput
              placeholder="Senha"
              data-testid="signin_password"
              autoComplete="none"
              name="password"
              type="password"
              required
            />
            <ButtonContainer>
              <Button color="primary">LOGIN</Button>
              <Button color="primary">CANCEL</Button>
            </ButtonContainer>
          </Form>
        </Card>
      </SignContainer>
    </Container>
  );
}
