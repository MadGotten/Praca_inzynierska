import { Text, View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import HealthService from "@/api/details/healthService";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import HealthForm from "@/components/forms/HealthForm";

interface ApiMessageError {
  message: {
    name?: string;
    description?: string;
    place?: string;
    date?: string;
  };
}

const HealthEdit = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { petId, healthId } = useLocalSearchParams();

  const { isPending, data } = useQuery({
    queryKey: ["health", healthId],
    queryFn: () => HealthService.get(Number(healthId)),
  });

  const mutation = useMutation<any, ApiMessageError, any>({
    mutationFn: (payload: any) => HealthService.update(Number(healthId), payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pets", petId, "records"] });
      queryClient.invalidateQueries({ queryKey: ["pets", petId, "health"] });
      queryClient.setQueryData(["health", healthId], data);
      router.back();
    },
  });

  return (
    <View style={[defaultStyles.container]}>
      <Text style={defaultStyles.headerText}>Edytuj aktywność</Text>
      {!isPending && <HealthForm mutation={mutation} initialValues={data} />}
    </View>
  );
};

export default HealthEdit;
