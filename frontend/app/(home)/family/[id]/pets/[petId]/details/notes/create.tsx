import { Text, View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import NoteService from "@/api/details/noteService";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import NoteForm from "@/components/forms/NoteForm";

interface ApiMessageError {
  message: {
    name?: string;
    description?: string;
  };
}

const NoteCreate = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { petId } = useLocalSearchParams();

  const mutation = useMutation<any, ApiMessageError, any>({
    mutationFn: (payload: any) => NoteService.create(Number(petId), payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pets", petId, "notes"] });
      router.back();
    },
  });

  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.headerText}>Dodaj notatkę</Text>
      <NoteForm mutation={mutation} />
    </View>
  );
};

export default NoteCreate;
