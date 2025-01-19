import ActionSheet, { ActionSheetRef, SheetProps } from "react-native-actions-sheet";
import { useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import FamilyService from "@/api/familyService";
import { useQueryClient } from "@tanstack/react-query";
import useFamilyRole from "@/hooks/useFamilyRole";

const FamilySheet = (props: SheetProps<"family-sheet">) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const ref = useRef<ActionSheetRef>(null);
  const familyId = props.payload?.familyId;
  const { role, isLoadingRole } = useFamilyRole(Number(familyId));

  const deleteFamily = async () => {
    const { error } = await FamilyService.delete(Number(familyId));
    if (error) {
      console.error(error);
    } else {
      queryClient.invalidateQueries({ queryKey: ["families"] });
      ref.current?.hide();
      router.back();
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Potwierdź usunięcie",
      "Czy jesteś pewny, że chcesz usunąć tę rodzine?",
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Usuń",
          style: "destructive",
          onPress: () => deleteFamily(),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ActionSheet ref={ref} gestureEnabled>
      <View style={{ padding: 24, paddingTop: 8, gap: 8 }}>
        <Link href='/settings' onPress={() => ref.current?.hide()} asChild>
          <TouchableOpacity
            style={{
              padding: 10,
              borderRadius: 8,
            }}
          >
            <Text style={[styles.text, { textAlign: "center" }]}>Ustawienia</Text>
          </TouchableOpacity>
        </Link>
        <Link href='/family' replace onPress={() => ref.current?.hide()} asChild>
          <TouchableOpacity
            style={{
              padding: 10,
              borderRadius: 8,
            }}
          >
            <Text style={[styles.text, { textAlign: "center" }]}>Rodziny</Text>
          </TouchableOpacity>
        </Link>
        {!isLoadingRole && role === 1 && (
          <>
            <Link
              href={{ pathname: "/family/[id]/edit", params: { id: Number(familyId) } }}
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
            <TouchableOpacity
              onPress={handleDelete}
              style={{ backgroundColor: "red", padding: 10, borderRadius: 8 }}
            >
              <Text style={[styles.text, { color: "white", textAlign: "center" }]}>Usuń</Text>
            </TouchableOpacity>
          </>
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

export default FamilySheet;
