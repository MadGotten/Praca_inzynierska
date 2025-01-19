import { Text, View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import PetService, { PetCreateProps } from "@/api/petService";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import PetForm from "@/components/forms/PetForm";

interface ApiMessageError {
  message: {
    name?: string;
    species?: string;
    breed?: string;
    date_of_birth?: string;
    weight?: string;
  };
}

const PetCreate = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams();

  const mutation = useMutation<PetCreateProps, ApiMessageError, PetCreateProps>({
    mutationFn: (payload: PetCreateProps) => PetService.create(Number(id), payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["families", id] });
      queryClient.invalidateQueries({ queryKey: ["families", id, "pets"] });
      router.back();
    },
  });

  return (
    <View style={[defaultStyles.container]}>
      <Text style={defaultStyles.headerText}>Dodaj zwierzaka</Text>
      <PetForm mutation={mutation} />
    </View>
  );
};

export default PetCreate;
