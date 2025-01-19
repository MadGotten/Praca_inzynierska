import { TouchableOpacity, ActivityIndicator, Text, TouchableOpacityProps } from "react-native";
import { defaultStyles } from "@/constants/Styles";

interface ButtonProps extends TouchableOpacityProps {
  isLoading?: boolean;
  color?: string;
  textColor?: string;
  variant?: string;
  children: React.ReactNode;
}

const Button = ({
  isLoading,
  children,
  color,
  textColor,
  variant = "default",
  ...props
}: ButtonProps) => {
  const buttonTextVariant = {
    default: defaultStyles.buttonText,
    sm: defaultStyles.buttonTextSm,
  }[variant];
  const buttonVariant = {
    default: defaultStyles.button,
    sm: defaultStyles.buttonSm,
  }[variant];
  return (
    <TouchableOpacity
      style={[buttonVariant, color ? { backgroundColor: color } : null]}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          size='small'
          style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
          color={textColor}
        />
      ) : (
        <Text style={[buttonTextVariant, textColor ? { color: textColor } : null]}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
