import { Text, View } from "react-native";
import { defaultStyles } from "@/constants/Styles";
import { loginUser } from "@/api/userService";
import { useTokenStore } from "@/store/tokenStore";
import { useRouter } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LoginForm from "@/components/forms/LoginForm";

interface LoginUserInput {
  username: string;
  password: string;
}

interface ApiMessageError {
  message: {
    username?: string;
    password?: string;
    non_field_error?: string;
    email?: string;
  };
  code: string;
}

const SignIn = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAllTokens } = useTokenStore();

  const mutation = useMutation<any, ApiMessageError, LoginUserInput>({
    mutationFn: ({ username, password }) => loginUser({ username, password }),
    onSuccess: (data) => {
      setAllTokens(data);
      queryClient.resetQueries({ queryKey: ["families"], exact: true });
      router.replace("/(home)/family");
    },
    onError: (error) => {
      if (error.code === "403") {
        router.replace({ pathname: "/verify-email", params: { email: error.message?.email } });
      }
    },
  });

  return (
    <View style={[defaultStyles.container, { gap: 16 }]}>
      <Text style={defaultStyles.screenTitle}>Logowanie</Text>
      <LoginForm mutation={mutation} />
    </View>
  );
};

export default SignIn;
