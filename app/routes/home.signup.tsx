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
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Button } from "~/components/Button";

import { useActionData, useCatch } from "@remix-run/react";
import { createUserSession, signOut } from "~/utils/session.server";
import {
  FormValidator,
  FormValidatorErrors,
  SignUpValidator,
} from "~/utils/validation";
import { ZodError } from "zod";
import ErrorComponent from "~/components/Error";
import {
  adminAuth,
  createUserProfileDocument,
  signOutFirebase,
  signUp,
} from "~/utils/db.server";
import { updateProfile } from "firebase/auth";

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

const badRequest = (data: ActionData) => {
  return json(data, { status: 400 });
};

export const action: ActionFunction = async ({
  request,
}): Promise<Response | ActionData> => {
  const { name, email, password, password_confirm } = Object.fromEntries(
    await request.formData()
  );
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof password_confirm !== "string"
  ) {
    return badRequest({ formError: "Formulario enviado incorretamente" });
  }

  if (password !== password_confirm) {
    return badRequest({
      fieldErrors: {
        password: "Senha não confere",
        password_confirm: "Senha não confere",
      },
    });
  }
  try {
    const data = FormValidator(SignUpValidator, {
      name,
      email,
      password,
      password_confirm,
    });
    await signOut(request);
    const { user } = await signUp({
      email: data.email,
      password: data.password,
      displayName: data.name,
    });

    await createUserProfileDocument({ displayName: name }, user);
    await updateProfile(user, { displayName: name });

    const userToken = await user.getIdToken();

    if (!userToken) {
      throw new Error("Ocorreu um erro ao obter a chave de acesso do usuario");
    }

    return createUserSession(userToken, "/home");
  } catch (error: any) {
    if (error instanceof ZodError) {
      return {
        fields: { name, email, password, password_confirm },
        fieldErrors: FormValidatorErrors(error),
      };
    }

    switch (error.code) {
      case "auth/email-already-in-use":
        return badRequest({
          fields: { name, email, password, password_confirm },
          fieldErrors: { email: "Email em uso" },
        });

      case "auth/invalid-email":
        return badRequest({
          fields: { name, email, password, password_confirm },
          fieldErrors: { email: "Email invalido" },
        });
      case "auth/operation-not-allowed":
        return badRequest({
          fields: { name, email, password, password_confirm },
          formError:
            "Ocorreu um erro ao criar o usuario entre em contato com o administrador",
        });
      case "auth/weak-password":
        return badRequest({
          fields: { name, email, password, password_confirm },
          fieldErrors: {
            password: "Senha fraca",
            password_confirm: "Senha fraca",
          },
        });

      default:
        throw new Error(`An error occurred ${error.message}`);
    }
  }
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
              <FieldError>{actionData?.fieldErrors?.name}</FieldError>
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
              <FieldError>{actionData?.fieldErrors?.email}</FieldError>
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
              <FieldError>{actionData?.fieldErrors?.password}</FieldError>
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
              <FieldError>
                {actionData?.fieldErrors?.password_confirm}
              </FieldError>
            )}
            <ButtonContainer>
              <Button type="submit" color="primary">
                REGISTRAR
              </Button>
              <Button color="primary">CANCELAR</Button>
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
