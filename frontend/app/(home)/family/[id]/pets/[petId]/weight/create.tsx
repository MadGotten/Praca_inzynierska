import { Text, View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import WeightService from "@/api/details/weightService";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import WeightForm from "@/components/forms/WeightForm";

interface ApiMessageError {
  message: {
    weight?: string;
    date?: string;
  };
}

const WeightCreate = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { petId } = useLocalSearchParams();

  const mutation = useMutation<any, ApiMessageError, any>({
    mutationFn: (payload: any) => WeightService.create(Number(petId), payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pets", petId, "weights"] });
      router.back();
    },
  });

  return (
    <View style={[defaultStyles.container]}>
      <Text style={defaultStyles.headerText}>Dodaj wage</Text>
      <WeightForm mutation={mutation} />
    </View>
  );
};

export default WeightCreate;
