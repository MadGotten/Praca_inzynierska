import { Text, View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import VaccinationService from "@/api/details/vaccinationService";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import VaccinationForm from "@/components/forms/VaccinationForm";

interface ApiMessageError {
  message: {
    name?: string;
    description?: string;
    date?: string;
  };
}

const VaccinationEdit = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { petId, vaccinationId } = useLocalSearchParams();

  const { isPending, data } = useQuery({
    queryKey: ["vaccinations", vaccinationId],
    queryFn: () => VaccinationService.get(Number(vaccinationId)),
  });

  const mutation = useMutation<any, ApiMessageError, any>({
    mutationFn: (payload: any) => VaccinationService.update(Number(vaccinationId), payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pets", petId, "records"] });
      queryClient.invalidateQueries({ queryKey: ["pets", petId, "vaccinations"] });
      queryClient.setQueryData(["vaccinations", vaccinationId], data);
      router.back();
    },
  });

  return (
    <View style={[defaultStyles.container]}>
      <Text style={defaultStyles.headerText}>Edytuj aktywność</Text>
      {!isPending && <VaccinationForm mutation={mutation} initialValues={data} />}
    </View>
  );
};

export default VaccinationEdit;
