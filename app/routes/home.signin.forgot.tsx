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
import FormInput from "~/components/Input";
import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { sendPasswordResetEmail } from "firebase/auth";
import { SiThemoviedatabase } from "react-icons/si";
import { Link, useActionData, useCatch } from "@remix-run/react";
import { auth } from "~/utils/firebase-service";
import { Button } from "~/components/Button";
import ErrorComponent from "~/components/Error";

interface FormFields {
  email: string;
  password: string;
}

interface ActionData {
  formError?: string;
  fieldErrors?: Partial<FormFields>;
  fields?: Partial<FormFields>;
  success?: boolean;
  message?: string;
}

const badRequest = (data: ActionData) => {
  return json(data, { status: 400 });
};

export const action: ActionFunction = async ({
  params,
  request,
}): Promise<Response> => {
  const { email } = Object.fromEntries(await request.formData());
  if (typeof email !== "string" || !email) {
    return badRequest({ formError: "Formulario submetido incorretamente" });
  }
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    switch (error.code) {
      case "auth/invalid-email": {
        return badRequest({
          fields: { email },
          fieldErrors: { email: "Email invalido" },
        });
      }

      case "auth/user-not-found": {
        return badRequest({
          fields: { email },
          fieldErrors: {
            email: "Email não corresponde a nenhum usuario cadastrado",
          },
        });
      }

      default:
        throw new Error(`Um erro ocorreu - ${error.message}`);
    }
  }

  return json(
    { success: true, message: "Email enviado com sucesso" },
    { status: 200 }
  );
};

export default function ForgotPassword() {
  const actionData = useActionData<ActionData>();
  return (
    <Container>
      <SiThemoviedatabase size={90} style={{ fill: "white" }} />

      <SignContainer>
        <Card>
          {actionData?.success ? (
            <Title>Email para reset de senha enviado com sucesso! </Title>
          ) : (
            <>
              <Title>Recuperar senha </Title>
              <SubTitle>Entre com seu Email para criar nova senha</SubTitle>
              <Form method="post">
                <FormInput
                  placeholder="Email"
                  defaultValue={actionData?.fields?.email}
                  aria-invalid={Boolean(actionData?.fieldErrors?.email)}
                  autoComplete="none"
                  data-testid="signin_email"
                  name="email"
                  type="email"
                />

                {actionData?.fieldErrors?.email && (
                  <FieldError>{actionData.fieldErrors?.email}</FieldError>
                )}

                <ButtonContainer>
                  <Button type="submit" color="primary" name="email-login">
                    ENVIAR
                  </Button>
                </ButtonContainer>
                {actionData?.formError && (
                  <FormError>{actionData?.formError}</FormError>
                )}
              </Form>
              <SubTitle>
                Não se registrou ainda?{" "}
                <Link to="/home/signup">Clique aqui</Link>
              </SubTitle>
            </>
          )}
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
