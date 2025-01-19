import { Text, View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import ActivityService from "@/api/details/activityService";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import ActivityForm from "@/components/forms/ActivityForm";

interface ApiMessageError {
  message: {
    name?: string;
    duration?: string;
    date?: string;
  };
}

const ActivityCreate = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { petId } = useLocalSearchParams();

  const mutation = useMutation<any, ApiMessageError, any>({
    mutationFn: (payload: any) => ActivityService.create(Number(petId), payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pets", petId, "records"] });
      queryClient.invalidateQueries({ queryKey: ["pets", petId, "activities"] });
      router.back();
    },
  });

  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.headerText}>Dodaj aktywność</Text>
      <ActivityForm mutation={mutation} />
    </View>
  );
};

export default ActivityCreate;
