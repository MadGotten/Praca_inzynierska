import { Text, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { defaultStyles } from "@/constants/Styles";
import { verifyUser, resendVerifyUser } from "@/api/userService";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useMutation } from "@tanstack/react-query";

interface ApiMessageError {
  message: {
    code?: string;
    detail: string;
  };
}

const VerifyEmail = () => {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState("");
  const router = useRouter();

  const mutation = useMutation<any, ApiMessageError>({
    mutationFn: () => verifyUser({ email, code }),
    onSuccess: () => {
      resendMutation.reset();
      router.replace("/sign-in");
    },
    onError: (error) => {
      resendMutation.reset();
    },
  });

  const resendMutation = useMutation<any, ApiMessageError, any>({
    mutationFn: (email) => resendVerifyUser({ email }),
    onSuccess: () => {
      mutation.reset();
    },
  });

  const handleSubmit = () => {
    mutation.mutate();
  };

  const handleResendSubmit = () => {
    resendMutation.mutate(email);
  };
  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.screenTitle}>Zweryfikuj Email</Text>
      <View style={{ justifyContent: "center", flex: 1, gap: 8 }}>
        <Text style={defaultStyles.buttonTextSm}>
          Aby dokończyć tworzenie konta musisz wpisać kod aktywacyjny z otrzymanej wiadomości emial
        </Text>
        <InputField
          onChangeText={setCode}
          value={code}
          placeholder='Kod aktywacyjny'
          keyboardType='numeric'
          maxLength={6}
          error={mutation.error?.message?.code}
        />
        <Button onPress={handleSubmit} isLoading={mutation.isPending} variant='sm'>
          Zweryfikuj
        </Button>
        <TouchableOpacity onPress={handleResendSubmit}>
          <Text style={[defaultStyles.helpText, { padding: 4 }]}>
            Link aktywacyjny nie doszedł?
          </Text>
        </TouchableOpacity>
        {mutation.error?.message && mutation.error?.message.detail && (
          <Text style={[defaultStyles.helpText, { color: "red" }]}>
            {mutation.error?.message.detail}
          </Text>
        )}
        {resendMutation?.data && resendMutation?.data.detail && (
          <Text style={[defaultStyles.helpText, { color: "green" }]}>
            {resendMutation?.data.detail}
          </Text>
        )}
      </View>
    </View>
  );
};

export default VerifyEmail;
