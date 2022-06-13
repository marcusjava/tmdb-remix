import { useState } from "react";
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
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { SiThemoviedatabase } from "react-icons/si";
import { FaGoogle } from "react-icons/fa";
import FormInput from "~/components/Input";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Button } from "~/components/Button";
import { sessionLogin } from "~/utils/session.server";
import { Link, useActionData, useCatch, useFetcher } from "@remix-run/react";
import ErrorComponent from "~/components/Error";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

import { auth } from "~/utils/firebase-service";

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
  try {
    const { idToken } = Object.fromEntries(await request.formData());

    //type checking
    if (typeof idToken !== "string") {
      return badRequest({
        formError: "Erro ao recuperar o token de acesso do usuario",
      });
    }

    return await sessionLogin(request, idToken, "/home");
  } catch (error) {
    return badRequest({
      formError: "Ocorreu um erro ao criar a sessão do usuario",
    });
  }
};

export default function SignIn() {
  const [fields, setFields] = useState({ email: "", password: "" });
  const [fieldsError, setFieldsError] = useState({ email: "", password: "" });
  const actionData = useActionData<ActionData>();
  const fetcher = useFetcher();

  const signInWithEmail = async () => {
    const { email, password } = fields;
    try {
      if (!email || !password) {
        return;
      }
      await signOut(auth);
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      // if signin was successful then we have a user
      if (user) {
        const idToken = await auth.currentUser?.getIdToken();
        if (idToken) {
          fetcher.submit({ idToken, authType: "email" }, { method: "post" });
        }
      }
    } catch (error: any) {
      switch (error.code) {
        case "auth/wrong-password": {
          return setFieldsError({
            ...fieldsError,
            password: "Senha inválida",
          });
        }
        case "auth/invalid-email": {
          return setFieldsError({
            ...fieldsError,
            email: "Email invalido",
          });
        }

        case "auth/user-disabled": {
          return setFieldsError({
            ...fieldsError,
            email: "Usuario desabilitado",
          });
        }
        case "auth/user-not-found": {
          return setFieldsError({
            ...fieldsError,
            email: "Usuario não localizado",
          });
        }
        default:
          console.log(`An error occurred ${error.message}`);
      }
    }
  };

  const signInWithGoogle = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (res) => {
        const idToken = await res.user.getIdToken();
        fetcher.submit({ idToken, authType: "google" }, { method: "post" });
      })
      .catch((error: any) => {
        console.log("signInWithGoogle", error.message);
      });
  };

  return (
    <Container>
      <SiThemoviedatabase size={90} style={{ fill: "white" }} />

      <SignContainer>
        <Card>
          <Title>Já possuo uma conta</Title>
          <SubTitle>Entre com seu Email e Senha</SubTitle>
          <Form method="post">
            <FormInput
              placeholder="Email"
              value={fields.email}
              onChange={(e) => setFields({ ...fields, email: e.target.value })}
              defaultValue={actionData?.fields?.email}
              aria-invalid={Boolean(actionData?.fieldErrors?.email)}
              autoComplete="none"
              data-testid="signin_email"
              name="email"
              type="email"
            />

            {fieldsError?.email && (
              <FieldError>{fieldsError?.email}</FieldError>
            )}
            <FormInput
              placeholder="Senha"
              data-testid="signin_password"
              value={fields.password}
              onChange={(e) =>
                setFields({ ...fields, password: e.target.value })
              }
              aria-invalid={Boolean(fieldsError?.password)}
              autoComplete="none"
              name="password"
              type="password"
            />
            {fieldsError?.password && (
              <FieldError>{fieldsError?.password}</FieldError>
            )}
            <ButtonContainer>
              <Button
                type="button"
                color="primary"
                name="email-login"
                onClick={signInWithEmail}
              >
                LOGIN
              </Button>
              <Button color="primary" type="button" onClick={signInWithGoogle}>
                <FaGoogle />
                GOOGLE
              </Button>
            </ButtonContainer>
            {actionData?.formError && (
              <FormError>{actionData?.formError}</FormError>
            )}
          </Form>
          <SubTitle>
            Esqueceu a Senha? <Link to="/home/signin/forgot">Clique aqui</Link>
          </SubTitle>
        </Card>
      </SignContainer>
    </Container>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <ErrorComponent message={error.message} />;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 401) {
    return (
      <ErrorComponent message={caught.statusText} status={caught.status} />
    );
  }
}
