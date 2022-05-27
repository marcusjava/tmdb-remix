import {
  Container,
  SignContainer,
  Card,
  ButtonContainer,
  Title,
  SubTitle,
  Form,
  Error as FieldError,
  FormError,
} from "../styles/auth.styles";
import { SiThemoviedatabase } from "react-icons/si";
import { IconContext } from "react-icons";
import FormInput from "~/components/Input";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Button } from "~/components/Button";
import { auth } from "~/utils/firebase";
import { createUserSession } from "~/utils/session.server";
import { Link, useActionData, useCatch } from "@remix-run/react";

interface FormFields {
  email: string;
  password: string;
}

interface ActionData {
  formError?: string;
  fieldErrors?: Partial<FormFields>;
  fields?: Partial<FormFields>;
}

const badRequest = (data: ActionData) => {
  return json(data, { status: 400 });
};

export const action: ActionFunction = async ({
  request,
}): Promise<Response | ActionData | void> => {
  const { email, password } = Object.fromEntries(await request.formData());

  //type checking
  if (typeof email !== "string" || typeof password !== "string") {
    return badRequest({
      formError: "Formulario não foi enviado corretamente!",
    });
  }

  try {
    const { user } = await auth.signInWithEmailAndPassword(email, password);

    const userToken = await user?.getIdToken();
    if (!userToken) {
      throw new Error("Ocorreu um erro ao obter a chave de acesso do usuario");
    }
    return createUserSession(userToken, "/home");
  } catch (error: any) {
    switch (error.code) {
      case "auth/wrong-password": {
        return badRequest({
          fields: { email, password },
          fieldErrors: { password: "Senha incorreta" },
        });
      }
      case "auth/invalid-email": {
        return badRequest({
          fields: { email, password },
          fieldErrors: { email: "Email invalido" },
        });
      }

      case "auth/user-disabled": {
        return badRequest({
          fields: { email, password },
          fieldErrors: { email: "Usuario desabilitado" },
        });
      }
      case "auth/user-not-found": {
        return badRequest({
          fields: { email, password },
          fieldErrors: { email: "Usuario não encontrado" },
        });
      }
      default:
        throw new Error(`An error occurred ${error.message}`);
    }
  }
};

export default function SignIn() {
  const actionData = useActionData<ActionData>();

  return (
    <Container>
      <IconContext.Provider value={{ style: { fontSize: 90 } }}>
        <SiThemoviedatabase />
      </IconContext.Provider>
      <SignContainer>
        <Card>
          <Title>Já possuo uma conta</Title>
          <SubTitle>Entre com seu Email e Senha</SubTitle>
          <Form method="post">
            <FormInput
              placeholder="Email"
              defaultValue={actionData?.fields?.email}
              aria-invalid={Boolean(actionData?.fieldErrors?.email)}
              autoComplete="none"
              data-testid="signin_email"
              name="email"
              type="email"
              required
            />

            {actionData?.fieldErrors?.email && (
              <FieldError>{actionData?.fieldErrors?.email}</FieldError>
            )}
            <FormInput
              placeholder="Senha"
              data-testid="signin_password"
              defaultValue={actionData?.fields?.password}
              aria-invalid={Boolean(actionData?.fieldErrors?.password)}
              autoComplete="none"
              name="password"
              type="password"
              required
            />
            {actionData?.fieldErrors?.password && (
              <FieldError>{actionData?.fieldErrors?.password}</FieldError>
            )}
            <ButtonContainer>
              <Button type="submit" color="primary">
                LOGIN
              </Button>
              <Button color="primary">CANCEL</Button>
            </ButtonContainer>
            {actionData?.formError && (
              <FormError>{actionData?.formError}</FormError>
            )}
          </Form>
        </Card>
      </SignContainer>
    </Container>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="error-container">
      Something unexpected went wrong. Sorry about that.
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 401) {
    return (
      <div className="error-container">
        <p>You must be logged in to create a joke.</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }
}
