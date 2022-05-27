import { Link } from "@remix-run/react";
import { ErrorContainer, ErrorMessage, Card } from "./styles/error.styles";

type Props = {
  message?: string;
  status?: number;
};

export default function ErrorComponent({ message, status }: Props) {
  return (
    <ErrorContainer>
      <Card>
        {status && <ErrorMessage>{status}</ErrorMessage>}
        {message ? (
          <ErrorMessage>{message}</ErrorMessage>
        ) : (
          <ErrorMessage>Ocorreu um erro</ErrorMessage>
        )}

        <Link to="..">Voltar</Link>
      </Card>
    </ErrorContainer>
  );
}
