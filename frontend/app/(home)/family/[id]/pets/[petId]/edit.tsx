import { Text, View, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import PetService, { PetEditProps } from "@/api/petService";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import PetForm from "@/components/forms/PetForm";

interface ApiMessageError {
  message: {
    name?: string;
    species?: string;
    breed?: string;
    date_of_birth?: string;
  };
}

const PetEdit = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id, petId } = useLocalSearchParams();

  const { data: pet } = useQuery({
    queryKey: ["pets", petId],
    queryFn: () => PetService.get(Number(petId)),
  });

  const mutation = useMutation<PetEditProps, ApiMessageError, PetEditProps>({
    mutationFn: (payload: PetEditProps) => PetService.update(Number(petId), payload),
    onSuccess: (data) => {
      queryClient.setQueryData(["pets", petId], data);
      queryClient.invalidateQueries({ queryKey: ["families", id] });
      queryClient.invalidateQueries({ queryKey: ["families", id, "pets"] });
      router.back();
    },
  });

  return (
    <View style={[defaultStyles.container, { gap: 8 }]}>
      <Text style={defaultStyles.headerText}>Edytuj zwierzaka {pet?.name}</Text>
      <PetForm initialValues={pet} mutation={mutation} isEditing />
    </View>
  );
};

export const styles = StyleSheet.create({});

export default PetEdit;
