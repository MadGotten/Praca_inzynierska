import { Text, View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import ActivityService from "@/api/details/activityService";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import ActivityForm from "@/components/forms/ActivityForm";

interface ApiMessageError {
  message: {
    name?: string;
    duration?: string;
    date?: string;
  };
}

const ActivityEdit = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { petId, activityId } = useLocalSearchParams();

  const { isPending, data } = useQuery({
    queryKey: ["activities", activityId],
    queryFn: () => ActivityService.get(Number(activityId)),
  });

  const mutation = useMutation<any, ApiMessageError, any>({
    mutationFn: (payload: any) => ActivityService.update(Number(activityId), payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pets", petId, "records"] });
      queryClient.invalidateQueries({ queryKey: ["pets", petId, "activities"] });
      queryClient.setQueryData(["activities", activityId], data);
      router.back();
    },
  });

  return (
    <View style={[defaultStyles.container]}>
      <Text style={defaultStyles.headerText}>Edytuj aktywność</Text>
      {!isPending && <ActivityForm mutation={mutation} initialValues={data} />}
    </View>
  );
};

export default ActivityEdit;
