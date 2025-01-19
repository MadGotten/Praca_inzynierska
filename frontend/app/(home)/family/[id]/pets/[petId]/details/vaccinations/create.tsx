import { Text, View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import VaccinationService from "@/api/details/vaccinationService";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import VaccinationForm from "@/components/forms/VaccinationForm";

interface ApiMessageError {
  message: {
    name?: string;
    description?: string;
    date?: string;
  };
}

const VaccinationCreate = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { petId } = useLocalSearchParams();

  const mutation = useMutation<any, ApiMessageError, any>({
    mutationFn: (payload: any) => VaccinationService.create(Number(petId), payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pets", petId, "vaccinations"] });
      router.back();
    },
  });

  return (
    <View style={[defaultStyles.container]}>
      <Text style={defaultStyles.headerText}>Dodaj szczepienie</Text>
      <VaccinationForm mutation={mutation} />
    </View>
  );
};

export default VaccinationCreate;
