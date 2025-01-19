import { Text, View, StyleSheet, ScrollView, RefreshControl, Alert } from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import WeightService from "@/api/details/weightService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useQueryRefresh from "@/hooks/useQueryRefresh";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Button from "@/components/ui/Button";
import useFamilyRole from "@/hooks/useFamilyRole";

const WeightRetrieve = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id, petId, weightId } = useLocalSearchParams();

  const { data, refetch } = useQuery({
    queryKey: ["weights", weightId],
    queryFn: () => WeightService.get(Number(weightId)),
  });
  const { role, isLoadingRole, refreshRole } = useFamilyRole(Number(id));
  const { refreshing, handleRefresh } = useQueryRefresh(() => {
    refreshRole();
    refetch();
  });

  const deleteWeight = async () => {
    const { error } = await WeightService.delete(Number(weightId));
    if (!error) {
      queryClient.removeQueries({ queryKey: ["weights", weightId] });
      queryClient.invalidateQueries({ queryKey: ["pets", petId] });
      queryClient.invalidateQueries({ queryKey: ["pets", petId, "weights"] });
      router.back();
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Potwierdź usunięcie",
      "Czy jesteś pewny, że chcesz usunąć ten wpis?",
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Usuń",
          style: "destructive",
          onPress: () => deleteWeight(),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      contentContainerStyle={defaultStyles.container}
    >
      <Text
        style={{
          fontSize: 24,
          fontFamily: "Inter-Bold",
          textAlign: "left",
        }}
      >
        Szczegóły
      </Text>
      {data && (
        <>
          <View
            style={{
              padding: 8,
              gap: 12,
              backgroundColor: "#FFC043",
              borderRadius: 12,
              flexDirection: "row",
            }}
          >
            <View style={{ marginTop: 4 }}>
              <FontAwesome5 name='weight-hanging' size={22} color='black' />
            </View>
            <View style={{ gap: 4 }}>
              <View style={{ gap: 1 }}>
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 18 }}>{data.weight}</Text>
              </View>
              <View>
                <Text style={{ fontFamily: "Inter", fontSize: 15 }}>{data.date}</Text>
              </View>
            </View>
          </View>
          {!isLoadingRole && role <= 2 && (
            <View style={{ flexDirection: "column", gap: 8 }}>
              <Button
                onPress={() =>
                  router.push({
                    pathname: "./[weightId]/edit",
                    params: { weightId: data.id },
                  })
                }
              >
                Edytuj
              </Button>
              <Button onPress={handleDelete} color='red' textColor='white'>
                Usuń
              </Button>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

export const styles = StyleSheet.create({
  cardList: {
    display: "flex",
    gap: 8,
  },
  card: {
    padding: 12,
    flex: 1 / 3,
    backgroundColor: "#FFC043",
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
  },
  cardOwner: {
    fontFamily: "Inter-Medium",
  },
  interRegular: {
    fontFamily: "Inter",
    fontSize: 12,
  },
});

export default WeightRetrieve;
