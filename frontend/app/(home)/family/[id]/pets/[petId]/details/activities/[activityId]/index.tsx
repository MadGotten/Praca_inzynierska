import { Text, View, StyleSheet, ScrollView, RefreshControl, Alert } from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import ActivityService from "@/api/details/activityService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useQueryRefresh from "@/hooks/useQueryRefresh";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Button from "@/components/ui/Button";
import useFamilyRole from "@/hooks/useFamilyRole";

const ActivityRetrieve = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id, petId, activityId } = useLocalSearchParams();

  const { data, refetch } = useQuery({
    queryKey: ["activities", activityId],
    queryFn: () => ActivityService.get(Number(activityId)),
  });
  const { role, isLoadingRole, refreshRole } = useFamilyRole(Number(id));
  const { refreshing, handleRefresh } = useQueryRefresh(() => {
    refreshRole();
    refetch();
  });

  const deleteActivity = async () => {
    const { error } = await ActivityService.delete(Number(activityId));
    if (!error) {
      queryClient.removeQueries({ queryKey: ["activities", activityId] });
      queryClient.invalidateQueries({ queryKey: ["pets", petId] });
      queryClient.invalidateQueries({ queryKey: ["pets", petId, "records"] });
      queryClient.invalidateQueries({ queryKey: ["pets", petId, "activities"] });
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
          onPress: () => deleteActivity(),
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
        initialParams={{ activityId: activityId }}
      />
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
              <FontAwesome6 name='bone' size={24} color='black' />
            </View>
            <View style={{ gap: 4 }}>
              <View style={{ gap: 1 }}>
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 18 }}>{data.name}</Text>
                <Text style={{ fontFamily: "Inter", fontSize: 15 }}>Data: {data.date}</Text>
              </View>
              <View>
                <Text style={{ fontFamily: "Inter", fontSize: 15 }}>
                  Czas trwania: {data.duration}
                </Text>
              </View>
            </View>
          </View>
          {!isLoadingRole && role <= 2 && (
            <View style={{ flexDirection: "column", gap: 8 }}>
              <Button
                onPress={() =>
                  router.push({
                    pathname: "./[activityId]/update",
                    params: { activityId: data.id },
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

export default ActivityRetrieve;
