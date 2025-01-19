import { Text, View } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import FamilyService, { FamilyProps } from "@/api/familyService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

interface ApiMessageError {
  message: {
    name?: string;
  };
}

const FamilyCreate = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");

  const mutation = useMutation<FamilyProps, ApiMessageError, string>({
    mutationFn: (newName) => FamilyService.create(newName),
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: ["families"], exact: true });
      router.back();
    },
  });

  const handleSubmit = () => {
    mutation.mutate(name);
  };

  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.headerText}>Utwórz nową rodzinę</Text>
      <View>
        <InputField
          onChangeText={setName}
          value={name}
          autoFocus={true}
          maxLength={100}
          multiline
          placeholder='Nazwa rodziny'
          error={mutation.error?.message.name}
        />
      </View>
      <Button onPress={handleSubmit} isLoading={mutation.isPending}>
        Utwórz
      </Button>
    </View>
  );
};

export default FamilyCreate;
