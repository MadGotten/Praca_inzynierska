import { View, Text } from "react-native";
import { useState } from "react";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

const LoginForm = ({ mutation }: any) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    mutation.mutate({ username, password });
  };

  return (
    <View style={{ gap: 12 }}>
      <InputField
        onChangeText={setUsername}
        value={username}
        autoFocus={true}
        placeholder='Login'
        error={mutation.error?.message.username}
      />
      <InputField
        onChangeText={setPassword}
        value={password}
        placeholder={"Hasło"}
        secureTextEntry={true}
        error={mutation.error?.message.password}
      />
      {mutation.error?.message && mutation.error?.message.non_field_error && (
        <Text style={{ color: "red" }}>{mutation.error?.message.non_field_error}</Text>
      )}
      <Button onPress={handleSubmit} isLoading={mutation.isPending}>
        Zaloguj się
      </Button>
    </View>
  );
};

export default LoginForm;
