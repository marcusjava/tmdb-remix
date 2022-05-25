import { CustomButton } from "./styles/button.styles";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color: "danger" | "primary";
}
export const Button: React.FC<Props> = ({ children, color, ...props }) => {
  return (
    <CustomButton color={color} {...props}>
      {children}
    </CustomButton>
  );
};
