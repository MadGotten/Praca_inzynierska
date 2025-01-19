import { Text, View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import HealthService from "@/api/details/healthService";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import HealthForm from "@/components/forms/HealthForm";

interface ApiMessageError {
  message: {
    name?: string;
    description?: string;
    place?: string;
    date?: string;
  };
}

const HealthCreate = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { petId } = useLocalSearchParams();

  const mutation = useMutation<any, ApiMessageError, any>({
    mutationFn: (payload: any) => HealthService.create(Number(petId), payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pets", petId, "health"] });
      router.back();
    },
  });

  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.headerText}>Dodaj wpis zdrowia</Text>
      <HealthForm mutation={mutation} />
    </View>
  );
};

export default HealthCreate;
