import ActionSheet, { ActionSheetRef, SheetProps } from "react-native-actions-sheet";
import { useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
import useFamilyRole from "@/hooks/useFamilyRole";

const MembersListSheet = (props: SheetProps<"memberslist-sheet">) => {
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
        {!isLoadingRole && role === 1 && (
          <Link
            href={{
              pathname: "/family/[id]/invites/invite",
              params: { id: Number(props.payload?.familyId) },
            }}
            onPress={() => ref.current?.hide()}
            asChild
          >
            <TouchableOpacity style={{ backgroundColor: "blue", padding: 10, borderRadius: 8 }}>
              <Text style={[styles.text, { color: "white", textAlign: "center" }]}>
                Zaproś użytkownika
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

export default MembersListSheet;
