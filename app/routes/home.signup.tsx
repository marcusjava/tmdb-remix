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
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Button } from "~/components/Button";
import { auth, getCurrentUser, signUp } from "~/utils/firebase";
import { useActionData } from "@remix-run/react";
import { createUserSession } from "~/utils/session.server";

interface FormFields {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
}

interface ActionData {
  formError?: string;
  fieldErrors?: Partial<FormFields>;
  fields?: Partial<FormFields>;
}

export const loader: LoaderFunction = async ({ params, request }) => {
  return null;
};

const badRequest = (data: ActionData) => {
  return json(data, { status: 400 });
};

export const action: ActionFunction = async ({
  request,
}): Promise<Response> => {
  const form = await request.formData();
  const name = form.get("name");
  const email = form.get("email");
  const password = form.get("password");
  const password_confirm = form.get("password_confirm");
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof password_confirm !== "string"
  ) {
    return badRequest({ formError: "Form not submited correctly" });
  }

  if (password !== password_confirm) {
    return badRequest({
      fieldErrors: {
        password: "Password mismatch",
        password_confirm: "Password mismatch",
      },
    });
  }
  try {
    await auth.signOut();
    await signUp({ email, password, displayName: name });

    const userToken = await auth.currentUser?.getIdToken();

    if (!userToken) {
      return badRequest({ formError: "Error to get user token" });
    }

    return createUserSession(userToken, "/home");
  } catch (error: any) {
    console.log("route", error.message);

    return badRequest({
      fieldErrors: {
        email: "The email address is already in use by another account",
      },
    });
  }
  //REGISTER USER
  //SET COOKIES
  //REDIRECT TO HOME
};

export default function SignUp() {
  const actionData = useActionData<ActionData>();
  return (
    <Container>
      <IconContext.Provider value={{ style: { fontSize: 90 } }}>
        <SiThemoviedatabase />
      </IconContext.Provider>
      <SignContainer>
        <Card>
          <Title>Não possuo uma conta</Title>
          <SubTitle>Preencha este formulario com suas informações</SubTitle>
          <Form method="post">
            <FormInput
              placeholder="Nome"
              autoComplete="none"
              data-testid="signin_name"
              defaultValue={actionData?.fields?.name}
              aria-invalid={Boolean(actionData?.fieldErrors?.name)}
              name="name"
              type="text"
              required
            />
            {actionData?.fieldErrors?.name && (
              <Error>{actionData?.fieldErrors?.name}</Error>
            )}
            <FormInput
              placeholder="Email"
              autoComplete="none"
              defaultValue={actionData?.fields?.email}
              aria-invalid={Boolean(actionData?.fieldErrors?.email)}
              data-testid="signin_email"
              name="email"
              type="email"
              required
            />
            {actionData?.fieldErrors?.email && (
              <Error>{actionData?.fieldErrors?.email}</Error>
            )}
            <FormInput
              placeholder="Senha"
              data-testid="password"
              defaultValue={actionData?.fields?.password}
              aria-invalid={Boolean(actionData?.fieldErrors?.password)}
              autoComplete="none"
              name="password"
              type="password"
              required
            />
            {actionData?.fieldErrors?.password && (
              <Error>{actionData?.fieldErrors?.password}</Error>
            )}
            <FormInput
              placeholder="Confirmar Senha"
              data-testid="password_confirm"
              defaultValue={actionData?.fields?.password_confirm}
              aria-invalid={Boolean(actionData?.fieldErrors?.password_confirm)}
              autoComplete="none"
              name="password_confirm"
              type="password"
              required
            />
            {actionData?.fieldErrors?.password_confirm && (
              <Error>{actionData?.fieldErrors?.password_confirm}</Error>
            )}
            <ButtonContainer>
              <Button type="submit" color="primary">
                REGISTRAR
              </Button>
              <Button color="primary">CANCELAR</Button>
            </ButtonContainer>
          </Form>
        </Card>
      </SignContainer>
    </Container>
  );
}
