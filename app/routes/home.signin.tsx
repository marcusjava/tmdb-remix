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
import { json } from "@remix-run/node";
import { Button } from "~/components/Button";
import { auth } from "~/utils/firebase";
import { createUserSession } from "~/utils/session.server";
import { useActionData } from "@remix-run/react";

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
}): Promise<Response> => {
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");

  //type checking
  if (typeof email !== "string" || typeof password !== "string") {
    return badRequest({ formError: "Form not submited correctly" });
  }
  // ZOD here!!!!

  try {
    const { user } = await auth.signInWithEmailAndPassword(email, password);
    if (!user) {
      return badRequest({
        fields: { email, password },
        formError: "Email/Password incorrect or user not exists!",
      });
    }
    const userToken = await user.getIdToken();
    return createUserSession(userToken, "/home");
  } catch (error: any) {
    console.log("ERROR", error.message);
    return badRequest({
      fields: { email, password },
      fieldErrors: { email: "Verify email", password: "Verify password" },
      formError: error.message,
    });
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
              <Error>{actionData?.fieldErrors?.email}</Error>
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
              <Error>{actionData?.fieldErrors?.password}</Error>
            )}
            <ButtonContainer>
              <Button type="submit" color="primary">
                LOGIN
              </Button>
              <Button color="primary">CANCEL</Button>
            </ButtonContainer>
          </Form>
        </Card>
      </SignContainer>
    </Container>
  );
}
