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

export default function SignUp() {
  return (
    <Container>
      <IconContext.Provider value={{ style: { fontSize: 90 } }}>
        <SiThemoviedatabase />
      </IconContext.Provider>
      <SignContainer>
        <Card>
          <Title>Não possuo uma conta</Title>
          <SubTitle>Preencha este formulario com suas informações</SubTitle>
          <Form>
            <FormInput
              placeholder="Nome"
              autoComplete="none"
              data-testid="signin_name"
              name="email"
              type="email"
              required
            />
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
            <FormInput
              placeholder="Confirmar Senha"
              data-testid="signin_password_confirm"
              autoComplete="none"
              name="password_confirm"
              type="password"
              required
            />
            <ButtonContainer>
              <Button color="primary">REGISTRAR</Button>
              <Button color="primary">CANCELAR</Button>
            </ButtonContainer>
          </Form>
        </Card>
      </SignContainer>
    </Container>
  );
}
