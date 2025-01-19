import { Text, View } from "react-native";
import { defaultStyles } from "@/constants/Styles";
import { registerUser } from "@/api/userService";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import RegisterForm from "@/components/forms/RegisterForm";

interface RegisterUserInput {
  username: string;
  email: string;
  password: string;
}

interface ApiMessageError {
  message: {
    username?: string;
    email?: string;
    password?: string;
    non_field_error?: string;
  };
}

const SignUp = () => {
  const router = useRouter();

  const mutation = useMutation<any, ApiMessageError, RegisterUserInput>({
    mutationFn: ({ username, email, password }) => registerUser({ username, email, password }),
    onSuccess: (data, { email }) => {
      router.replace({ pathname: "/verify-email", params: { email } });
    },
  });

  return (
    <View style={[defaultStyles.container, { gap: 16 }]}>
      <Text style={defaultStyles.screenTitle}>Rejestracja</Text>
      <RegisterForm mutation={mutation} />
    </View>
  );
};

export default SignUp;
