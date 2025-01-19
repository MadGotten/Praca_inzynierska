import ActionSheet, { ActionSheetRef, SheetProps } from "react-native-actions-sheet";
import { useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Link, useGlobalSearchParams, useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import PetService from "@/api/petService";
import useFamilyRole from "@/hooks/useFamilyRole";

const PetsDetailSheet = (props: SheetProps<"petsdetail-sheet">) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const ref = useRef<ActionSheetRef>(null);
  const { id } = useGlobalSearchParams();

  const { role, isLoadingRole } = useFamilyRole(Number(id));

  const deletePet = async () => {
    const { error } = await PetService.delete(Number(props.payload?.petId));
    if (error) {
      console.error(error);
    } else {
      queryClient.removeQueries({ queryKey: ["pets", Number(props.payload?.petId)] });
      queryClient.invalidateQueries({ queryKey: ["families", id] });
      queryClient.invalidateQueries({ queryKey: ["families", id, "pets"] });
      ref.current?.hide();
      router.back();
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Potwierdź usunięcie",
      "Czy jesteś pewny, że chcesz usunąć te zwierze?",
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Usuń",
          style: "destructive",
          onPress: () => deletePet(),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ActionSheet ref={ref} gestureEnabled>
      <View style={{ padding: 24, paddingTop: 8, gap: 8 }}>
        <Link
          href={{ pathname: "./[petId]/edit", params: { petId: Number(props.payload?.petId) } }}
          onPress={() => ref.current?.hide()}
          asChild
        >
          <TouchableOpacity
            style={{
              padding: 10,
              borderRadius: 8,
            }}
          >
            <Text style={[styles.text, { textAlign: "center" }]}>Edytuj</Text>
          </TouchableOpacity>
        </Link>
        {!isLoadingRole && role <= 2 && (
          <TouchableOpacity
            onPress={handleDelete}
            style={{ backgroundColor: "red", padding: 10, borderRadius: 8 }}
          >
            <Text style={[styles.text, { color: "white", textAlign: "center" }]}>Usuń</Text>
          </TouchableOpacity>
        )}
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 17,
    fontFamily: "Inter-SemiBold",
  },
});

export default PetsDetailSheet;
