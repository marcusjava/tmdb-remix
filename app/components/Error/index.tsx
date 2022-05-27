import { Link } from "@remix-run/react";
import { ErrorContainer, ErrorMessage } from "./styles/error.styles";

type Props = {
  message?: string;
  redirectTo?: string;
};

export default function ErrorComponent({ message, redirectTo }: Props) {
  return (
    <ErrorContainer>
      {message ? (
        <ErrorMessage>{message}</ErrorMessage>
      ) : (
        <ErrorMessage>
          Ocorreu um Erro por gentileza entre am contato com o Administrador
        </ErrorMessage>
      )}
      {redirectTo ? <Link to="..">Voltar</Link> : null}
    </ErrorContainer>
  );
}
