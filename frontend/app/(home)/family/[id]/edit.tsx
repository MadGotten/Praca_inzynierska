import { Text, View } from "react-native";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import FamilyService, { FamilyProps } from "@/api/familyService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

interface ApiMessageError {
  message: {
    name?: string;
  };
}

const FamilyEdit = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams();
  const [name, setName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    isPending,
    isError,
    data: family,
  } = useQuery({
    queryKey: ["families", id],
    queryFn: () => FamilyService.get(Number(id)),
  });

  useEffect(() => {
    if (!isPending && !isError) {
      setName(family.name);
    }
  }, [family]);

  const mutation = useMutation<FamilyProps, ApiMessageError, string>({
    mutationFn: (newName) => FamilyService.update(Number(id), newName),
    onSuccess: (data) => {
      queryClient.setQueryData(["families", id], (prev: FamilyProps) => {
        return { ...prev, name: data.name };
      });
      queryClient.setQueryData(["families"], (prev: any) => {
        const updatedPages = prev.pages.map((page: any) => {
          return {
            ...page,
            results: page.results.map((family: FamilyProps) =>
              family.id === data.id ? { ...family, name: data.name } : family
            ),
          };
        });

        return {
          ...prev,
          pages: updatedPages,
        };
      });
      router.back();
    },
    onSettled: () => {
      setIsSubmitted(false);
    },
  });

  const handleSubmit = () => {
    setIsSubmitted(true);
    mutation.mutate(name);
  };

  return (
    <View style={defaultStyles.container}>
      <Text numberOfLines={1} style={defaultStyles.headerText}>
        Edytuj {family?.name}
      </Text>
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
      <Button onPress={handleSubmit} isLoading={isSubmitted}>
        Zapisz
      </Button>
    </View>
  );
};

export default FamilyEdit;
