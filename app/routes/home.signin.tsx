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
import { useActionData, useCatch, useFetcher } from "@remix-run/react";
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
    return json(
      {
        errorCode: "login/general",
        errorMessage: "There was a problem loggin in",
      },
      { status: 500 }
    );
  }
};

export default function SignIn() {
  const [fields, setFields] = useState({ email: "", password: "" });
  const actionData = useActionData<ActionData>();
  const fetcher = useFetcher();

  const signInWithEmail = async () => {
    const { email, password } = fields;
    try {
      if (!email || !password) {
        return;
      }
      await signOut(auth);
      const authResp = await signInWithEmailAndPassword(auth, email, password);

      // if signin was successful then we have a user
      if (authResp.user) {
        const idToken = await auth.currentUser?.getIdToken();
        if (idToken) {
          fetcher.submit({ idToken, authType: "email" }, { method: "post" });
        }
      }
    } catch (err) {
      console.log("signInWithEmail", err);
    }
  };

  const signInWithGoogle = () => {
    //initializeApp(firebaseConfig);
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

            {actionData?.fieldErrors?.email && (
              <FieldError>{actionData?.fieldErrors?.email}</FieldError>
            )}
            <FormInput
              placeholder="Senha"
              data-testid="signin_password"
              value={fields.password}
              onChange={(e) =>
                setFields({ ...fields, password: e.target.value })
              }
              defaultValue={actionData?.fields?.password}
              aria-invalid={Boolean(actionData?.fieldErrors?.password)}
              autoComplete="none"
              name="password"
              type="password"
            />
            {actionData?.fieldErrors?.password && (
              <FieldError>{actionData?.fieldErrors?.password}</FieldError>
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
