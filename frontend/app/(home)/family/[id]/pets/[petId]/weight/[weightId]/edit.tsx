import { Text, View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import WeightService from "@/api/details/weightService";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import WeightForm from "@/components/forms/WeightForm";

interface ApiMessageError {
  message: {
    weight?: string;
    date?: string;
  };
}

const WeightEdit = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { petId, weightId } = useLocalSearchParams();

  const { isPending, data } = useQuery({
    queryKey: ["weights", weightId],
    queryFn: () => WeightService.get(Number(weightId)),
  });

  const mutation = useMutation<any, ApiMessageError, any>({
    mutationFn: (payload: any) => WeightService.update(Number(weightId), payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pets", petId, "records"] });
      queryClient.invalidateQueries({ queryKey: ["pets", petId, "weights"] });
      queryClient.setQueryData(["weights", weightId], data);
      router.back();
    },
  });

  console.log(data);

  return (
    <View style={[defaultStyles.container]}>
      <Text style={defaultStyles.headerText}>Edytuj Wagę</Text>
      {!isPending && <WeightForm mutation={mutation} initialValues={data} />}
    </View>
  );
};

export default WeightEdit;
