import { Label, Input } from "./styles/input.styles";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  name: string;
}

export default function FormInput({
  handleChange,
  label,
  name,
  ...props
}: Props) {
  return (
    <>
      {label && <Label>{label}</Label>}
      <Input {...props} />
    </>
  );
}
