import { Text, View, StyleSheet, ScrollView, RefreshControl, Alert } from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import NoteService from "@/api/details/noteService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useQueryRefresh from "@/hooks/useQueryRefresh";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Button from "@/components/ui/Button";
import useFamilyRole from "@/hooks/useFamilyRole";

const NoteRetrieve = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id, petId, noteId } = useLocalSearchParams();

  const { data, refetch } = useQuery({
    queryKey: ["notes", noteId],
    queryFn: () => NoteService.get(Number(noteId)),
  });
  const { role, isLoadingRole, refreshRole } = useFamilyRole(Number(id));
  const { refreshing, handleRefresh } = useQueryRefresh(() => {
    refreshRole();
    refetch();
  });

  const deleteNote = async () => {
    const { error } = await NoteService.delete(Number(noteId));
    if (!error) {
      queryClient.removeQueries({ queryKey: ["notes", noteId] });
      queryClient.invalidateQueries({ queryKey: ["pets", petId] });
      queryClient.invalidateQueries({ queryKey: ["pets", petId, "records"] });
      queryClient.invalidateQueries({ queryKey: ["pets", petId, "notes"] });
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
          onPress: () => deleteNote(),
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
        initialParams={{ noteId }}
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
              <FontAwesome6 name='note-sticky' size={24} color='black' />
            </View>
            <View style={{ gap: 4, flex: 1 }}>
              <Text style={{ fontFamily: "Inter-Medium", fontSize: 16 }}>{data.name}</Text>
              <Text style={{ fontFamily: "Inter", fontSize: 15 }}>{data.description}</Text>
            </View>
          </View>
          {!isLoadingRole && role <= 2 && (
            <View style={{ flexDirection: "column", gap: 8 }}>
              <Button
                onPress={() =>
                  router.push({
                    pathname: "./[noteId]/update",
                    params: { noteId: data.id },
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

export default NoteRetrieve;
