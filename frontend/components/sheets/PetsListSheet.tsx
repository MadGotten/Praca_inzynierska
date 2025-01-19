import ActionSheet, { ActionSheetRef, SheetProps } from "react-native-actions-sheet";
import { useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
import useFamilyRole from "@/hooks/useFamilyRole";

const PetsListSheet = (props: SheetProps<"petslist-sheet">) => {
  const ref = useRef<ActionSheetRef>(null);
  const { role, isLoadingRole } = useFamilyRole(Number(props.payload?.familyId));

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
        {!isLoadingRole && role <= 2 && (
          <Link
            href={{
              pathname: "/family/[id]/pets/create",
              params: { id: Number(props.payload?.familyId) },
            }}
            onPress={() => ref.current?.hide()}
            asChild
          >
            <TouchableOpacity style={{ backgroundColor: "green", padding: 10, borderRadius: 8 }}>
              <Text style={[styles.text, { color: "white", textAlign: "center" }]}>
                Dodaj zwierzaka
              </Text>
            </TouchableOpacity>
          </Link>
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

export default PetsListSheet;
