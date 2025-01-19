import { Text, View, StyleSheet, ScrollView, RefreshControl, Alert } from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import HealthService from "@/api/details/healthService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useQueryRefresh from "@/hooks/useQueryRefresh";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Button from "@/components/ui/Button";
import useFamilyRole from "@/hooks/useFamilyRole";

const HealthRetrieve = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id, petId, healthId } = useLocalSearchParams();

  const { data, refetch } = useQuery({
    queryKey: ["health", healthId],
    queryFn: () => HealthService.get(Number(healthId)),
  });

  const { role, isLoadingRole, refreshRole } = useFamilyRole(Number(id));
  const { refreshing, handleRefresh } = useQueryRefresh(() => {
    refreshRole();
    refetch();
  });

  const deleteHealth = async () => {
    const { error } = await HealthService.delete(Number(healthId));
    if (!error) {
      queryClient.removeQueries({ queryKey: ["health", healthId] });
      queryClient.invalidateQueries({ queryKey: ["pets", petId] });
      queryClient.invalidateQueries({ queryKey: ["pets", petId, "records"] });
      queryClient.invalidateQueries({ queryKey: ["pets", petId, "health"] });
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
          onPress: () => deleteHealth(),
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
      <Stack.Screen
        options={{
          title: data?.name || "",
        }}
        initialParams={{ healthId: healthId }}
      />
      <Text style={defaultStyles.headerText}>Szczegóły</Text>
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
              <FontAwesome6 name='heart-circle-plus' size={30} color='black' />
            </View>
            <View style={{ gap: 4, flex: 1 }}>
              <View style={{ gap: 1 }}>
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 18 }}>{data.name}</Text>
                <View style={{ flexDirection: "row", gap: 4 }}>
                  <Text style={{ fontFamily: "Inter", fontSize: 13 }}>{data.date}</Text>
                  <View style={{ borderLeftWidth: 1 }} />
                  <Text style={{ fontFamily: "Inter", fontSize: 13 }}>{data.place}</Text>
                </View>
              </View>
              <View>
                <Text style={{ fontFamily: "Inter", fontSize: 15 }}>{data.description}</Text>
              </View>
            </View>
          </View>
          {!isLoadingRole && role <= 2 && (
            <View style={{ flexDirection: "column", gap: 8 }}>
              <Button
                onPress={() =>
                  router.push({
                    pathname: "./[healthId]/update",
                    params: { healthId: data.id },
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

export default HealthRetrieve;
