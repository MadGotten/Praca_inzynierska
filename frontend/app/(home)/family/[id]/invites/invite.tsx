import { Text, View } from "react-native";
import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import InviteService, { InviteProps } from "@/api/inviteService";
import { useMutation } from "@tanstack/react-query";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

interface ApiMessageError {
  message: {
    user?: string;
    detail?: string;
  };
}

const InviteCreate = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [username, setUsername] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const mutation = useMutation<InviteProps, ApiMessageError, string>({
    mutationFn: (invitedUser) => InviteService.invite(id.toString(), invitedUser),
    onSuccess: (data) => {
      router.back();
    },
    onSettled: () => {
      setIsSubmitted(false);
    },
  });

  const handleSubmit = () => {
    setIsSubmitted(true);
    mutation.mutate(username);
  };

  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.headerText}>Zaproś użytkownika</Text>
      <View>
        <InputField
          onChangeText={setUsername}
          value={username}
          autoFocus={true}
          placeholder='Nazwa użytkownika'
          error={mutation.error?.message.user}
        />
      </View>
      {mutation.error?.message && mutation.error?.message.detail && (
        <Text style={{ color: "red" }}>{mutation.error?.message.detail}</Text>
      )}
      <Button onPress={handleSubmit} isLoading={isSubmitted}>
        Zaproś
      </Button>
    </View>
  );
};

export default InviteCreate;
