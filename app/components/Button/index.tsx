import { CustomButton } from "./styles/button.styles";

type Props = {
  color: "danger" | "primary";
};
export const Button: React.FC<Props> = ({ children, color, ...props }) => {
  return (
    <CustomButton color={color} {...props}>
      {children}
    </CustomButton>
  );
};
