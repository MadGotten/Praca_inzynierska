import { Text, View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import NoteService from "@/api/details/noteService";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import NoteForm from "@/components/forms/NoteForm";

interface ApiMessageError {
  message: {
    name?: string;
    description?: string;
  };
}

const NoteEdit = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { petId, noteId } = useLocalSearchParams();

  const { isPending, data } = useQuery({
    queryKey: ["notes", noteId],
    queryFn: () => NoteService.get(Number(noteId)),
  });

  const mutation = useMutation<any, ApiMessageError, any>({
    mutationFn: (payload: any) => NoteService.update(Number(noteId), payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pets", petId, "records"] });
      queryClient.invalidateQueries({ queryKey: ["pets", petId, "notes"] });
      queryClient.setQueryData(["notes", noteId], data);
      router.back();
    },
  });

  return (
    <View style={[defaultStyles.container]}>
      <Text style={defaultStyles.headerText}>Edytuj aktywność</Text>
      {!isPending && <NoteForm mutation={mutation} initialValues={data} />}
    </View>
  );
};

export default NoteEdit;
